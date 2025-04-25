
import { Card } from "@/components/ui/card";

export const MessageList = () => {
  // TODO: Fetch messages from Supabase (we'll implement this after setting up the database)
  const messages: any[] = [];

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages.map((message) => (
        <Card key={message.id} className="p-3">
          <div className="font-semibold">{message.user}</div>
          <div>{message.content}</div>
        </Card>
      ))}
    </div>
  );
};
