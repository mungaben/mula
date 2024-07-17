export async function fetchPhoneNumbers() {
    const response = await fetch('/api/phonenumbers');
    if (response.ok) {
      return await response.json();
    } else {
      return [];
    }
  }
  
  export async function initiateDeposit(data: any) {
    const response = await fetch('/api/deposit/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    return await response.json();
  }



// lib/api.ts
export async function requestWithdrawal(data: { userId: string, simPhoneNumberId: string, amount: number }) {
  try {
    const response = await fetch('/api/withdraw/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit withdrawal request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting withdrawal request:', error);
    throw error;
  }
}
