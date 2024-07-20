"use server"



// Actions.ts
export const getProduct = async ({ productId, userId }: { productId: string; userId: string }) => {
    const response = await fetch(`/api/products/${productId}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to buy product');
    }
  
    return response.json();
  };
  