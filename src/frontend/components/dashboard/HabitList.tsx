import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddHabitDialog from "./AddHabitDialog";
import HabitCard from "./HabitCard";

interface HabitListProps {
  userId?: string;
}

const HabitList = ({ userId }: HabitListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: habits, isLoading } = useQuery({
    queryKey: ["habits", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: habitLogs } = useQuery({
    queryKey: ["habit-logs", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, isCompleted }: { habitId: string; isCompleted: boolean }) => {
      if (!userId) throw new Error("User not authenticated");
      
      const today = new Date().toISOString().split('T')[0];
      
      if (isCompleted) {
        // Delete the log entry
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_at", today);
        
        if (error) throw error;
      } else {
        // Create a log entry
        const { error } = await supabase
          .from("habit_logs")
          .insert({
            habit_id: habitId,
            user_id: userId,
            completed_at: today,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", userId] });
      toast({
        title: "Success! 🎉",
        description: "Habit updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return habitLogs?.some(
      (log) => log.habit_id === habitId && log.completed_at === today
    ) || false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading habits...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Habits</CardTitle>
              <CardDescription>Track your daily habits and build streaks</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {habits && habits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isHabitCompletedToday(habit.id)}
                  onToggle={() => toggleHabitMutation.mutate({
                    habitId: habit.id,
                    isCompleted: isHabitCompletedToday(habit.id),
                  })}
                  userId={userId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No habits yet. Start building your hero!</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddHabitDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        userId={userId}
      />
    </div>
  );
};

export default HabitList;
