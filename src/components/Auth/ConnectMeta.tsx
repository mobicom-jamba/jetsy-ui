"use client";

import MetaSetupGuide from "./MetaSetupGuide";

interface ConnectMetaProps {
  className?: string;
}

export default function ConnectMeta({ className }: ConnectMetaProps) {
  return (
    <div className={className}>
      <MetaSetupGuide />
    </div>
  );
}
