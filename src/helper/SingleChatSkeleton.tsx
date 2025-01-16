import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo({
  avatarSize = "h-12 w-12",
  titleWidth = "w-[250px]",
  subtitleWidth = "w-[200px]",
}: {
  avatarSize?: string;
  titleWidth?: string;
  subtitleWidth?: string;
}) {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Skeleton className={`${avatarSize} rounded-full`} />
        <div className="space-y-2">
          <Skeleton className={`h-4 ${titleWidth}`} />
          <Skeleton className={`h-4 ${subtitleWidth}`} />
        </div>
      </div>
    </>
  );
}
