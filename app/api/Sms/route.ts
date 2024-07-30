import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, DepositStatus, WithdrawalStatus } from "@prisma/client";
import { prisma } from '@/lib/prisma';
import Withdrawals from '../../../components/homepage/Withdrawals';

type SmsBody = {
  from: string;
  text: string;
  sentStamp: number;
  receivedStamp: number;
  sim: string;
};

/**
 * Extracts details from the SMS text to determine transaction type, name, phone number, and amount.
 * @param text The text message content.
 * @returns An object containing the type, name, phone number, and amount extracted from the message.
 **/
const extractDetails = (text: string) => {
  const receivedRegex = /You have received Ksh (\d+\.\d{2}) from (?:MPESA - )?([A-Z\s]+) (\d{12})\. TID:/i;

  // const sentRegex = /Ksh (\d+\.\d{2}) SENT to (.+) (\d+) on/;
  const sentRegex = /Ksh(\d+\.\d{2})\s+sent\s+to\s+([A-Z\s]+)\s+(\d{10})/i;

  const receivedMatch = text.match(receivedRegex);
  const sentMatch = text.match(sentRegex);

  if (receivedMatch) {
    const amount = parseFloat(receivedMatch[1]);
    const name = receivedMatch[2];
    const phoneNumber = receivedMatch[3];
    return { type: 'received', name, phoneNumber, amount };
  }

  if (sentMatch) {
    const amount = parseFloat(sentMatch[1]);
    const name = sentMatch[2].trim();
    const phoneNumber = sentMatch[3];
    return { type: 'sent', name, phoneNumber, amount };
  }

  return { type: null, name: null, phoneNumber: null, amount: null };
};

/**
 * Checks if a message is an overlap by verifying if the same amount was sent by the same person 
 * within the last 5 minutes.
 * @param details An object containing phone number and amount.
 * @param receivedStamp The timestamp when the message was received.
 * @returns A boolean indicating whether the message is an overlap.
 */
const isOverlapMessage = async (details: { phone: string, amount: number }, receivedStamp: number) => {
  const fiveMinutesAgo = new Date(receivedStamp - 10 * 60 * 1000);

  const user = await prisma.user.findUnique({
    where: { phone: details.phone },
    select: { id: true }
  });

  console.info("user in overlapsing", user)

  if (!user) {
    return false;
  }

  const overlapMessage = await prisma.deposit.findFirst({
    where: {
      userId: user.id,
      amount: details.amount,
      createdAt: {
        gte: fiveMinutesAgo,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.error("overlapmessage", overlapMessage)

  return !!overlapMessage;
};


const isOverlapWithdrawalMessage = async (details: { phone: string, amount: number }, receivedStamp: number) => {
  const tenMinutesAgo = new Date(receivedStamp - 1 * 60 * 1000);

  const user = await prisma.user.findUnique({
    where: { phone: details.phone },
    select: { id: true }
  });

  console.info("user in overlapping withdrawal check", user);

  if (!user) {
    return false;
  }

  const overlapMessage = await prisma.withdrawalRequest.findFirst({
    where: {
      userId: user.id,
      amount: details.amount,
      createdAt: {
        gte: tenMinutesAgo,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return !!overlapMessage;
};



/**
 * Handles the POST request for processing an SMS message.
 * @param req The incoming request object.
 * @returns A response object indicating the status of the request.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();


  const sms: SmsBody = body;



  console.warn("sms",sms)

  if (!sms) {
    console.log("Invalid request body");
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { from, text, sentStamp, receivedStamp, sim } = sms;


  console.info("text info:----------------------------------------------------------------------------------------")
  console.info("text info:", text)
  console.info("text info:----------------------------------------------------------------------------------------")
  console.warn("**************************************************************************************************************")
  console.log("from", from);
  console.log("sentStamp", new Date(sentStamp).toISOString());
  console.log("receivedStamp", new Date(receivedStamp).toISOString());
  console.log("currentTime", new Date().toISOString());
  console.warn("**************************************************************************************************************")


  // Check if the message is from the correct sender
  if (from !== 'airtelmoney') {
    console.log("Invalid sender");
    return NextResponse.json({ error: "Invalid sender" }, { status: 400 });
  }

  const currentTime = new Date().getTime();
  const fiveMinutesInMillis = 5 * 60 * 1000;

  // Check if the message is stale (received more than 5 minutes ago)
  if (currentTime - receivedStamp > fiveMinutesInMillis) {
    console.log("Message is stale");
    return NextResponse.json({ error: "Message is stale" }, { status: 400 });
  }

  const { type, name, phoneNumber, amount } = extractDetails(text);
  console.log("extracted details", "type:", type, "name:", name, "phoneNumber:", phoneNumber, "amount:", amount);

  if (!type) {
    console.log("Failed to extract type");
    return NextResponse.json({ error: "Failed to extract type" }, { status: 400 });
  }

  if (!name) {
    console.log("Failed to extract name");
    return NextResponse.json({ error: "Failed to extract name" }, { status: 400 });
  }

  if (!phoneNumber) {
    console.log("Failed to extract phone number");
    return NextResponse.json({ error: "Failed to extract phone number" }, { status: 400 });
  }

  if (!amount) {
    console.log("Failed to extract amount");
    return NextResponse.json({ error: "Failed to extract amount" }, { status: 400 });
  }

   // Normalize the phone number by replacing '254' with '0' if it starts with '254'
   const normalizedPhoneNumber = phoneNumber.startsWith('254') ? phoneNumber.replace('254', '0') : phoneNumber;

   try {
     const user = await prisma.user.findUnique({
       where: { phone: normalizedPhoneNumber },
     });



     

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (type === 'received') {
      if (await isOverlapMessage({ phone: phoneNumber, amount }, receivedStamp)) {
        console.warn("Overlap detected: Same person, amount, and time within 5 minutes");
        await prisma.unsuccessfulDeposit.create({
          data: {
            userId: user.id,
            amount,
            reason: "Overlap detected",
          },
        });
        return NextResponse.json({ error: "Overlap detected" }, { status: 400 });
      }

      console.log("Processing deposit");
      const awaitingDeposit = await prisma.awaitingDeposit.findFirst({
        where: {
          userId: user.id,
          amount,
          status: DepositStatus.PENDING,
          initiatedAt: {
            gte: new Date(new Date().getTime() - 10 * 60 * 1000), // within the last 10 minutes
          },
        },
        orderBy: {
          initiatedAt: 'desc',
        },
      });


      await prisma.deposit.create({
        data: {
          userId: user.id,
          amount,
          status: DepositStatus.FULFILLED,
          createdAt: new Date(receivedStamp),
        },
      });

      if (awaitingDeposit) {

        await prisma.awaitingDeposit.update({
          where: { id: awaitingDeposit.id },
          data: {
            status: DepositStatus.FULFILLED,
          },
        });


      }




      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: amount },
        },
      });


      console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
      console.info("user updated________________________------------------", user.name, '---------------------------')
      console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")




      console.log("Deposit created and user balance updated");

      // Fetch the commission records for this user
      const pendingCommissions = await prisma.commission.findMany({
        where: {
          userId: user.id,
          pending: true,
        },
      });

      console.warn("Fetched pending commissions===================================", pendingCommissions, "============================");

      for (const commission of pendingCommissions) {
        const referral = await prisma.referral.findFirst({
          where: {
            referrerId: commission.referrerId,
            refereeId: commission.userId,
          },
        });

        console.warn("Fetched referral", referral, "+++++++++++++++++++++++++++++++++++++++++");


        if (referral) {
          const config = await prisma.config.findFirst();
          if (!config) {
            console.log("Configuration not found");
            return NextResponse.json({ error: 'Configuration not found' }, { status: 500 });
          }
          const percentage = referral.level === 1 ? config.level1Percentage : (referral.level === 2 ? config.level2Percentage : config.level3Percentage);

          const commissionAmount = (amount * percentage) / 100;

          console.log("commissionamount", commissionAmount)

          await prisma.commission.update({
            where: { id: commission.id },
            data: {
              amount: commissionAmount,
              pending: false,
            },
          });



          await prisma.user.update({
            where: { id: commission.referrerId },
            data: {
              balance: { increment: commissionAmount },
            },
          });

          console.log(`Updated commission and referrer's balance for referral level ${referral.level}`);
        }
      }

      console.warn("*******************************************Deposit processed successfully***********************************************");
      return NextResponse.json({ message: "Deposit processed successfully" }, { status: 200 });
    }

    if (type === 'sent') {

      console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%,sent message received    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")


      if (await isOverlapWithdrawalMessage({ phone: phoneNumber, amount }, receivedStamp)) {
        console.warn("Overlap detected: Same person, amount, and time within 5 minutes");
        return NextResponse.json({ error: "Overlap detected" }, { status: 400 });
      }


      const withdrawalRequest = await prisma.withdrawalRequest.findFirst({
        where: {
          userId: user.id,
          amount,
          status: WithdrawalStatus.REQUESTED,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });



      console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
      console.warn(" withdrawalRequest", withdrawalRequest)
      console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")

      if (!withdrawalRequest) {
        console.warn("no  withdrawalRequest", withdrawalRequest)
        await prisma.unsuccessfulWithdrawal.create({
          data: {
            userId: user.id,
            amount,
            reason: "No matching withdrawal request found",
          },
        });
        return NextResponse.json({ error: "No matching withdrawal request found" }, { status: 404 });
      }

      const config = await prisma.config.findFirst();
      if (!config) {
        return NextResponse.json({ error: "Configuration not found" }, { status: 500 });
      }

      const withdrawalFee = amount
      const totalDeduction = amount

      if (user.balance < totalDeduction) {
        await prisma.unsuccessfulWithdrawal.create({
          data: {
            userId: user.id,
            amount,
            reason: "Insufficient balance for withdrawal",
          },
        });
        return NextResponse.json({ error: "Insufficient balance for withdrawal" }, { status: 400 });
      }



      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: totalDeduction } },
      });


      await prisma.withdrawalRequest.update({
        where: { id: withdrawalRequest.id },
        data: { status: WithdrawalStatus.APPROVED },
      });

    
      return NextResponse.json({ message: "Withdrawal processed successfully" }, { status: 200 });
    }




  } catch (error) {
    console.error("Error processing deposit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
