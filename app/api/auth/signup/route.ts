import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Adjust the path as needed for your prisma client


async function generateUniqueReferralLink(base: string): Promise<string> {
  let referralLink = base;
  let suffix = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { referralLink },
    });

    if (!existingUser) {
      break;
    }

    referralLink = `${base}${suffix}`;
    suffix++;
  }

  return referralLink;
}

export async function POST(req: NextRequest) {
  const { email, password, name, phone } = await req.json();

  // Validate required fields
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    // Check if the user already exists by email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }
      if (existingUser.phone === phone) {
        return NextResponse.json({ error: 'User with this phone number already exists' }, { status: 400 });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a base referral link
    const baseReferralLink = name ? name.replace(/\s+/g, '').toLowerCase() : 'user';
    const referralLink = await generateUniqueReferralLink(baseReferralLink);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Store the hashed password
        name: name || null,
        phone: phone || '', // Provide a default value if phone is not provided
        referralLink, // Store the unique referral link
      },
    });

    // Respond with the created user
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error instanceof Error) {
      if (error) {
        return NextResponse.json({ error: 'Unique constraint failed' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
