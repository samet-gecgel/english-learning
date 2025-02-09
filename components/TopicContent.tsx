interface TopicContentProps {
  content: string
}

const TopicContent = ({ content }: TopicContentProps) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content }} 
      className="topic-content"
    />
  )
}

export default TopicContent 