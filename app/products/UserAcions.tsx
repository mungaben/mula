import { useRouter } from "next/navigation";
 // Ensure you have a toast library or component to show notifications
import getuser from "@/app/products/getuser";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
 // Ensure you have a Button component

interface ActionButtonsProps {
  productId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ productId }) => {
  const router = useRouter();

  const handleBuyProduct = async () => {
    const session = await getuser();

    if (!session) {
      toast({
        title: "Error!",
        description: "You must be logged in to buy a product.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/Buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error!",
          description: errorData.error || "Failed to buy product",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Product purchased successfully.",
      });
      router.push("/dashboard/Profile");
    } catch (error) {
      console.error("Error buying product:", error);

      toast({
        title: "Error!",
        description: "An error occurred while buying the product.",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button className="text-green-500" onClick={handleBuyProduct}>
        Buy
      </Button>
    </div>
  );
};

export default ActionButtons;
