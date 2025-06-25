import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { useState } from "react";
import { toast } from "sonner";

export default function MoodCheck() {
  const [mood, setMood] = useState<string | null>(null);

  const handleSubmit = () => {
    if (mood) {
      toast.success(`You selected: ${mood}`, {
        className: "bg-popover text-popover-foreground border border-border",
      });
    } else {
      toast.error("Please select a mood!", {
        className: "bg-destructive text-destructive-foreground border border-border",
      });
    }
  };

  return (
    <Card className="w-full rounded-xl">
      <CardContent className="flex flex-col gap- p-2">
        <CardTitle className="flex items-center gap-2 text-md pb-0 text-black dark:text-white">Mood Check</CardTitle>
        <ToggleGroup type="single" className="flex justify-between mb-2" onValueChange={(value) => setMood(value)}>
          <ToggleGroupItem value="sad" className="text-xl  rounded-full data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10">
            😢
          </ToggleGroupItem>
          <ToggleGroupItem value="neutral" className="text-xl  rounded-full data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10">
            😐
          </ToggleGroupItem>
          <ToggleGroupItem value="good" className="text-xl  rounded-full data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10">
            😊
          </ToggleGroupItem>
          <ToggleGroupItem value="great" className="text-xl  rounded-full data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10">
            😄
          </ToggleGroupItem>
          <ToggleGroupItem value="excellent" className="text-xl  rounded-full data-[state=on]:border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10">
            ⭐
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={handleSubmit} className="w-full bg-gray-200 text-black hover:bg-gray-300 dark:bg-muted dark:text-white ">
          Valider
        </Button>
      </CardContent>
    </Card>
  );
}
