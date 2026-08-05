import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function TestimonialCard({ testimonial }: { testimonial: TestimonialCardData }) {
  const meta = [testimonial.programmeName, testimonial.batchYear ? `Batch ${testimonial.batchYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="h-full justify-between gap-6 p-6">
      <Quote className="size-8 text-accent" />
      <p className="flex-1 text-sm text-card-foreground/90">“{testimonial.quote}”</p>
      <div className="flex items-center gap-3">
        <Avatar>
          {testimonial.photoUrl && <AvatarImage src={testimonial.photoUrl} alt="" />}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials(testimonial.studentName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-semibold text-foreground">{testimonial.studentName}</div>
          {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
        </div>
      </div>
    </Card>
  );
}
