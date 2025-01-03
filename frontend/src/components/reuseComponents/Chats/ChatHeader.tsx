import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface ChatHeaderProps{
    name:string;
    isOnline:boolean;
    onMenuClick:()=>void;
}

const ChatHeader = ({name,isOnline,onMenuClick}:ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onMenuClick}
    >
      <FontAwesomeIcon icon={faBars} />
    </Button>
    <div>
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className={`text-sm  ${isOnline?'text-green-500':'text-muted-foreground'}`}>
        {isOnline ? "Online" : ""}
      </p>
    </div>
    <div className="w-10 lg:hidden" />
  </div>
  )
}

export default ChatHeader