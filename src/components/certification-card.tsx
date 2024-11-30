import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { Avatar, AvatarImage } from "./ui/avatar";

interface Props {
  title: string;
  issuingOrganization: string;
  logoUrl: string;
  dateIssued: string;
  credentialId: string;
  url: string;
}

export function CertificationCard({
  title,
  issuingOrganization,
  logoUrl,
  dateIssued,
  credentialId,
  url,
}: Props) {
  return (
    <Card
      className={
        "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full"
      }
    >
      <Link href={"#"}>
        {logoUrl && (
          <Avatar className="size-12 border">
            <AvatarImage src={logoUrl} className="object-contain" />
          </Avatar>
        )}
      </Link>
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">{title}</CardTitle>
          <time className="font-sans text-xs">{dateIssued}</time>
          <div className="hidden font-sans text-xs underline print:visible">
            {url?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            {issuingOrganization}
          </Markdown>
        </div>
      </CardHeader>
      {/* <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[10px]"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent> */}
      <CardFooter className="px-2 pb-2">
        <div>{credentialId}</div>
      </CardFooter>
    </Card>
  );
}
