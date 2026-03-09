interface IframePageProps {
  src: string;
  title: string;
}

export function IframePage({ src, title }: IframePageProps) {
  return (
    <iframe
      src={src}
      title={title}
      className="w-full border-0"
      style={{ height: '100vh', minHeight: '100vh' }}
    />
  );
}
