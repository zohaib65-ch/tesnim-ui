import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

type Notification = {
  time: string;
  title: string;
  description: string;
};

type CardProps = React.ComponentProps<typeof Card> & {
  notification1: Notification;
  notification2: Notification;
};

export function NotificationCard({ notification1, notification2 }: CardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between p-2">
        <CardTitle className="p-0 text-md">Notifications</CardTitle>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="grid gap-4 p-2">
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">{notification1.time}</p>
            <p className="text-sm font-medium leading-none">{notification1.title}</p>
            <p className="text-sm text-muted-foreground">{notification1.description}</p>
          </div>
        </div>
      </CardContent>
      <CardContent className="grid gap-4 p-2">
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">{notification2.time}</p>
            <p className="text-sm font-medium leading-none">{notification2.title}</p>
            <p className="text-sm text-muted-foreground">{notification2.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
