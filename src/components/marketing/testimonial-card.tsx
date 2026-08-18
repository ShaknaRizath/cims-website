import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface TestimonialCardData {
  studentName: string;
  programmeName?: string | null;
  batchYear?: number | null;
  quote: string;
  photoUrl?: string | null;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({
  testimonial,
  isCenter = false,
}: {
  testimonial: TestimonialCardData;
  isCenter?: boolean;
}) {
  const meta = [testimonial.programmeName, testimonial.batchYear ? `Batch ${testimonial.batchYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card
      className={cn(
        "relative h-full justify-between gap-4 overflow-visible p-6 pt-20 transition-all duration-[400ms] ease-out",
        isCenter && "lg:-translate-y-1 lg:scale-105 lg:shadow-xl",
      )}
    >
      <Avatar className="absolute left-1/2 top-0 size-32 -translate-x-1/2 -translate-y-1/2 border-4 border-background shadow-md sm:size-36">
        {testimonial.photoUrl && <AvatarImage src={testimonial.photoUrl} alt="" />}
        <AvatarFallback className="bg-primary text-3xl text-primary-foreground">
          {initials(testimonial.studentName)}
        </AvatarFallback>
      </Avatar>
      <Quote className="size-8 text-accent" />
      <p className="flex-1 text-sm text-card-foreground/90">“{testimonial.quote}”</p>
      <div>
        <div className="text-sm font-semibold text-foreground">{testimonial.studentName}</div>
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      </div>
    </Card>
  );
}
