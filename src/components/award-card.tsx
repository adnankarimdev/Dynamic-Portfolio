interface Props {
  title: string;
  organization: string;
  dateAwarded: string;
  description: string;
  image?: string;
}

export function AwardsCard({
  title,
  organization,
  dateAwarded,
  description,
  image,
}: Props) {
  return (
    <li className="relative ml-10 py-4">
      {/* <div className="absolute -left-16 top-2 flex items-center justify-center bg-white rounded-full">
        <Avatar className="border size-12 m-auto">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
      </div> */}
      <div className="flex flex-1 flex-col justify-start gap-1">
        {dateAwarded && (
          <time className="text-xs text-muted-foreground">{dateAwarded}</time>
        )}
        <h2 className="font-semibold leading-none">{title}</h2>
        {organization && (
          <p className="text-sm text-muted-foreground">{organization}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </li>
  );
}
