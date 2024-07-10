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



  export async function requestWithdrawal(data: { userId: string; simPhoneNumberId: string; amount: number }) {
    const response = await fetch('/api/withdrawal/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    return await response.json();
  }
  