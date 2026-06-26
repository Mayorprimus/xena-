import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bell, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Sparkles, 
  X,
  Volume2,
  VolumeX,
  Megaphone,
  Smile,
  MoreVertical,
  Paperclip,
  Search,
  Check,
  Info,
  ChevronDown
} from 'lucide-react';
import { GlobalMessage, UserWallet } from '../types';

interface GlobalChatViewProps {
  wallet: UserWallet;
  globalMessages: GlobalMessage[];
  onSendMessage: (text: string) => void;
  onClearMessage?: (messageId: string) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  isAdmin?: boolean;
}

// Telegram-style Emojis categorized with high aesthetic grouping
const EMOJI_GROUPS = [
  {
    category: '😀 Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '🤫', '🤔', '🫣', '🤭', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷']
  },
  {
    category: '👍 Gestures & Hearts',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🧠', '👀', '👁️', '👄', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝']
  },
  {
    category: '🚀 Objects & Tech',
    emojis: ['💻', '🖥️', '⌨️', '🖱️', '🪙', '💵', '💴', '💶', '💷', '💸', '💳', '🧾', '✉️', '📧', '📨', '📩', '📦', '🏷️', '🛎️', '🔑', '🗝️', '🔨', '🛠️', '⚙️', '⚖️', '⛓️', '🧱', '🔭', '🔬', '📡', '🧪', '🧬', '🩺', '🌡️', '🕯️', '🔦', '🏮', '📖', '📕', '📗', '📘', '📙', '📓', '📒', '📝', '🗒️', '🗓️', '📆', '📅', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🔒', '🔓', '🔏', '🔐']
  },
  {
    category: '🌍 Travel & Places',
    emojis: ['🚗', '🏎️', '🚓', '🚑', '🚒', '🛵', '🏍️', '🚲', '🛴', '🛹', '✈️', '🛫', '🛬', '🚀', '🛸', '🛰️', '🚢', '🛥️', '⛵', '⚓', '🚨', '🌠', '🌌', '🌍', '🌎', '🌏', '🗺️', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏢', '🏥', '🏦', '🏨', '🏪', '🏫', '🏬', '🏭', '🏰', '🏯', '🏛️', '⛪', '🕌', '🕍', '⛩️']
  }
];

// Emoji Search Helper Keywords
const EMOJI_NAMES: { [emoji: string]: string } = {
  '😀': 'smile happy grin laugh',
  '😃': 'smile happy laugh',
  '😄': 'smile happy laugh',
  '😁': 'smile happy grin',
  '😆': 'smile laugh squint',
  '😅': 'sweat laugh hot smile',
  '😂': 'joy laugh tear crying laughing',
  '🤣': 'rofl laugh roll rolling laughing',
  '😊': 'blush smile happy eye warm',
  '😇': 'halo angel innocent',
  '🙂': 'smile slight',
  '🙃': 'upside down',
  '😉': 'wink blinking',
  '😌': 'relieved relieved warm',
  '😍': 'heart eye love lovely',
  '🥰': 'love heart warm smiling adore',
  '😘': 'kiss blow loving',
  '😗': 'kiss',
  '😋': 'yum delicious delicious tasty food',
  '😛': 'tongue cheeky',
  '😝': 'tongue cheeky',
  '😜': 'wink tongue cheeky blinking',
  '🤪': 'zany crazy wild',
  '🤨': 'eyebrow raised skeptical unsuspicious',
  '🧐': 'monocle smart class',
  '🤓': 'nerd smart geek glass',
  '😎': 'cool sun glass shade shadow smart',
  '🥸': 'disguise mask',
  '🤩': 'star eye amazing wow starstruck',
  '🥳': 'party celebrate hat horn birthday',
  '😏': 'smirk half smile cheeky',
  '😒': 'unamused annoyed unloved',
  '😞': 'sad disappointed bad',
  '😔': 'sad pensive quiet',
  '😟': 'worried anxious',
  '😕': 'confused uncertain',
  '🙁': 'sad slight frown',
  '☹️': 'sad frown frowning',
  '🥺': 'please plead cute cry beg baby',
  '😢': 'cry sad tear crying weeping',
  '😭': 'cry sob tear crying loud weeping',
  '😤': 'steam nose proud victory win',
  '😠': 'angry mad annoyed',
  '😡': 'angry rage pout mad',
  '🤬': 'curse swear bad mad angry',
  '🤯': 'explode mind blown brain shocking',
  '😳': 'blush flush surprised shock eye',
  '🥵': 'hot red sweat heat summer burn',
  '🥶': 'cold blue ice freeze winter frozen',
  '😱': 'scream fear shock horror panic',
  '🤫': 'shh quiet silent whisper secret',
  '🤔': 'think ponder question mind skeptical',
  '🫣': 'peek spy look secret eye',
  '🤭': 'giggle oops laugh cheek',
  '🥱': 'yawn tired sleepy sleep',
  '😴': 'sleep zzz tired snoring',
  '🤤': 'drool delicious hungry sleep',
  '😪': 'sleepy tired tear sleep',
  '😵': 'dizzy dead shock',
  '🤐': 'zip quiet silent secret mouth',
  '🥴': 'drunk woozy dizzy sick',
  '🤢': 'sick green throwup nauseated disgusted',
  '🤮': 'puke throwup vomit sick',
  '🤧': 'sneeze cold flu sick tissue',
  '😷': 'mask sick flu doc medical protection',
  '👋': 'wave hello hi goodbye bye',
  '🤚': 'backhand raised hand highfive',
  '🖐️': 'hand splay finger',
  '✋': 'stop highfive hand',
  '🖖': 'vulcan spock live long prosper',
  '👌': 'ok okay correct fine perfect good',
  '🤌': 'italian chef kiss gesture hand perfect',
  '🤏': 'pinch small little bit',
  '✌️': 'peace win victory sign blinking fingers',
  '🤞': 'cross fingers luck lucky hope hoping',
  '🫰': 'heart finger love money sign',
  '🤟': 'love sign finger hand',
  '🤘': 'rock metal horn sign finger',
  '🤙': 'call callme hand phone',
  '👈': 'left finger point',
  '👉': 'right finger point',
  '👆': 'up point finger top upper',
  '🖕': 'middle finger insult',
  '👇': 'down point finger bottom lower',
  '☝️': 'point index up first',
  '👍': 'like up thumb thumbsup perfect agree good yes',
  '👎': 'dislike down thumb thumbsdown bad disagree no',
  '✊': 'fist power resist hold raise',
  '👊': 'fist punch hit boom',
  '🤛': 'fist left punch',
  '🤜': 'fist right punch',
  '👏': 'clap praise hand sound well congratulations',
  '🙌': 'raise hand celebrate praise highfive',
  '👐': 'open hand spread',
  '🤲': 'pray hands open book book',
  '🤝': 'shake hands deal agree partner business meet',
  '🙏': 'pray please thank highfive hope bowing',
  '✍️': 'write pen note draw sign pencil',
  '💅': 'nail polish cosmetic beauty style',
  '🤳': 'selfie phone camera snap',
  '💪': 'strong muscle power bicep fitness flex weight',
  '🧠': 'brain smart mind thinking intel',
  '👀': 'eye look see spy watch notice',
  '👁️': 'eye look single',
  '👄': 'mouth lip kiss talk speak',
  '❤️': 'heart love red life heart beat core',
  '🧡': 'heart orange love',
  '💛': 'heart yellow love',
  '💚': 'heart green love',
  '💙': 'heart blue love ocean sky water',
  '💜': 'heart purple love luxury',
  '🖤': 'heart black love dark sleek',
  '🤍': 'heart white love clean',
  '🤎': 'heart brown love',
  '💔': 'heartbreak broken sad love split',
  '❣️': 'exclamation heart love tag attention red',
  '💕': 'hearts double love loving',
  '💞': 'hearts spinning love warm',
  '💓': 'heartbeat pulse sound love life',
  '💗': 'heart grow love',
  '💖': 'sparkle heart shiny love gold',
  '💘': 'cupid heart love arrow shoot',
  '💝': 'ribbon heart gift present',
  '💻': 'computer laptop tech screen code work dev developer programming pc',
  '🖥️': 'monitor desktop screen pc computer work desk',
  '⌨️': 'keyboard type click tech computer pc',
  '🖱️': 'mouse click tech computer pc',
  '🪙': 'coin gold dollar money xena cash invest rich crypto',
  '💵': 'dollar bills money green cash cashout transfer cost price rich',
  '💴': 'yen bills cash money',
  '💶': 'euro bills money cash transfer',
  '💷': 'pound bills money cash pound',
  '💸': 'money wings fly loss spend win profit cash high speed',
  '💳': 'credit card bank purchase pay shop deposit withdraw money online visa mastercard',
  '🧾': 'receipt bill invoice paper account tax log transaction',
  '✉️': 'letter email post mail envelop inbox send',
  '📧': 'email letter post message box internet mail mail',
  '📨': 'mail receive post incoming inbox',
  '📩': 'mail send letter post outgoing arrow',
  '📦': 'package box delivery post shipping gift stock',
  '🏷️': 'tag label price sale badge info',
  '🛎️': 'bell service hotel ring call help',
  '🔑': 'key secure code login password unlock access token',
  '🗝️': 'key old classic password secure unlock access',
  '🔨': 'hammer tool build construction break crash fix repair',
  '🛠️': 'tools repair build fix construct wrench hammer screwdriver',
  '⚙️': 'gear setup settings config optimize build engine machine dynamic',
  '⚖️': 'scale balance justice law measure weights court audit',
  '⛓️': 'chain secure lock connect bind link hold',
  '🧱': 'brick wall blocks build home construction',
  '🔭': 'telescope space stars lookup search discover sci sky',
  '🔬': 'microscope science lab research doctor check look scan medical',
  '📡': 'satellite dish space connection transmit signals network tower',
  '🧪': 'test tube science chemistry experiment reaction liquid medicine lab',
  '🧬': 'dna science cells genealogy bio genetic research life',
  '🩺': 'stethoscope doctor heart check medical health pulse sick',
  '🌡️': 'thermometer hot cold temperature weather fever health sick',
  '🕯️': 'candle flame light fire slow warm wax light',
  '🔦': 'flashlight torch light beam bright searching seek night dark',
  '🏮': 'lantern light red paper lamp asian festival',
  '📖': 'book read library study paper notes manual documentation',
  '📕': 'book red read',
  '📗': 'book green read manual',
  '📘': 'book blue read documentation',
  '📙': 'book orange read',
  '📓': 'notebook diary journal paper write notes',
  '📒': 'ledger log accounting transactions audit data table list',
  '📝': 'memo write note checklist task list paper sign pen pencil',
  '🗒️': 'spiral notepad paper note write text',
  '🗓️': 'calendar dates schedule events plan list month diary',
  '📆': 'calendar dates schedules plan event page',
  '📅': 'calendar system date days month year event scheduler',
  '📈': 'chart trend up profit increase rise grow growth high highrate success invest dividend',
  '📉': 'chart trend down loss crash decrease low price rate drop risk deficit',
  '📊': 'bar chart status metrics records statistics analysis index',
  '📋': 'clipboard text notes files record checks forms lists report',
  '📌': 'pushpin pin map marker tag hold paper red',
  '📍': 'round pushpin pin map location route address tag hold marker red',
  '📎': 'paperclip clip files attach attachment notes paper',
  '🔒': 'lock secure password encrypt closed locked privacy safe key code',
  '🔓': 'unlock password open clear decrypted accessibility safe key free',
  '🔏': 'lock pen secure password encrypted draft sign write privacy key',
  '🔐': 'key secure locked closed padlock access password clear keygen safe',
  '🚗': 'car auto transport vehicle drive travel ride road street red',
  '🏎️': 'racing car speed race formula fast drive track',
  '🚓': 'police car patrol alarm security security cop law siren flash',
  '🚑': 'ambulance hospital medical emergency speed siren rescue aid',
  '🚒': 'fire engine truck emergency rescue water hose sire alarm flash red',
  '🛵': 'scooter travel ride transport street gas bike vespa',
  '🏍️': 'motorcycle motor transport vehicle drive speed bike racing',
  '🚲': 'bicycle bike ride sports cardio travel transport wheel pedal',
  '🛴': 'scooter kick travel play ride',
  '🛹': 'skateboard skate play sports ride street board',
  '✈️': 'plane airplane flight sky jet travel fly booking vacation tour abroad',
  '🛫': 'takeoff flight plane travel depart leave booking jet sky',
  '🛬': 'landing plane travel arrive ground airport flight terminal jet sky',
  '🚀': 'rocket moon space launch speed fast token pump xena sky cosmic high fly power progress',
  '🛸': 'ufo alien space cosmic mystery mystery flying saucer ufo',
  '🛰️': 'satellite space broadcast transmit connection gps tracking signals sky',
  '🚢': 'ship boat cruise sea marine water transport voyage booking',
  '🛥️': 'motorboat boat luxury sea ocean water speed yacht transport',
  '⛵': 'sailboat wind ship sea water sail transport ride',
  '⚓': 'anchor sea ship boat marina harbor hold secure weight ocean',
  '🚨': 'siren alarm police emergency security flash danger warning light red police',
  '🌠': 'shooting star wish sky cosmic night dark shiny light',
  '🌌': 'milky way space stars universe cosmic galaxy night deep dark sky',
  '🌍': 'earth globe africa europe travel world map planet cosmic land',
  '🌎': 'earth globe america travel world map planet cosmic land',
  '🌏': 'earth globe asia australia travel world map planet cosmic land',
  '🗺️': 'map travel route plan location navigator atlas country world layout',
  '🏔️': 'snow mountain ice travel alpine peak high rock',
  '⛰️': 'mountain rock travel peak high terrain trail',
  '🌋': 'volcano lava eruption hot fire rock active blast crash boom',
  '🗻': 'fuji mountain japan travel peak high snow landmark',
  '🏕️': 'camping tent campfire travel trees wild nature woods night',
  '⛺': 'tent camping shelter shade travel camp',
  '🏠': 'house home building realestate residential live address stay land property',
  '🏡': 'house garden home building residential property garden trees lawn realestate',
  '🏢': 'office building business enterprise company corporation workplace skyscraper realestate',
  '🏥': 'hospital doctor medical clinic medicine healthcare clinic emergency',
  '🏦': 'bank cash money central credit capital finance deposit cashout treasury building',
  '🏨': 'hotel rooms booking vacation stay sleep suite luxury building',
  '🏪': 'store shop convenience 24h market open groceries everyday building',
  '🏫': 'school education high academy primary students books learn building',
  '🏬': 'department store luxury shop clothes brand mall building',
  '🏭': 'factory industry build manufacture production chimney plant facility building',
  '🏰': 'castle royal old classic landmark royal fort heritage building',
  '🏯': 'japanese castle landmark traditional building',
  '🏛️': 'classical building central bank museum court index archives treasury building',
  '⛪': 'church cathedral chapel faith hope building',
  '🕌': 'mosque dome faith building',
  '🕍': 'synagogue faith building',
  '⛩️': 'shinto shrine torii landmark traditional japanese gates'
};

// Map sender's UID to a beautiful Telegram-style sender name color
const getSenderColor = (uid: string) => {
  const colors = [
    'text-emerald-400',
    'text-amber-400',
    'text-sky-400',
    'text-rose-400',
    'text-fuchsia-400',
    'text-orange-400',
    'text-teal-400',
    'text-pink-400',
    'text-cyan-400'
  ];
  
  if (uid === 'XENA-SYSTEM') return 'text-indigo-400';
  
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function GlobalChatView({
  wallet,
  globalMessages,
  onSendMessage,
  onClearMessage,
  onToggleReaction,
  isAdmin = false
}: GlobalChatViewProps) {
  const [inputText, setInputText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Input area Emoji Picker States
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false);
  const [inputEmojiSearchQuery, setInputEmojiSearchQuery] = useState('');
  const [activeEmojiTab, setActiveEmojiTab] = useState('😀 Smileys');

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Play sound alert
    if (soundEnabled && globalMessages.length > 0) {
      try {
        const lastMsg = globalMessages[globalMessages.length - 1];
        const isFromMe = (lastMsg.senderEmail || '').toLowerCase() === (wallet?.email || '').toLowerCase();
        if (!isFromMe && Date.now() - lastMsg.timestamp < 3000) {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 Note
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 Note
          
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }
      } catch (e) {
        // Ignored browser audio guidelines
      }
    }
  }, [globalMessages, soundEnabled, wallet.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
    setShowInputEmojiPicker(false);
  };

  const handleQuickReaction = (messageId: string, emoji: string) => {
    onToggleReaction?.(messageId, emoji);
    setActivePickerId(null);
  };

  // Filter messages based on search query
  const filteredMessages = globalMessages.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderUid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic participant count list
  const uniqueParticipantsCount = Math.max(8, new Set(globalMessages.map(m => m.senderEmail.toLowerCase())).size + 5);

  const announcements = [
    {
      id: 'ann-1',
      title: 'Lafarge Africa option compounding active',
      desc: 'All option compounding rollover interest has been synced securely. Check your active options tab.',
      time: '10 mins ago'
    },
    {
      id: 'ann-2',
      title: 'Global Shareholder Lounge Launched',
      desc: 'The official XENA lounge is now live for global communications. Maintain corporate decorum.',
      time: '1 hour ago'
    }
  ];

  // Logic to filter emojis for input area picker
  const getFilteredEmojis = () => {
    if (!inputEmojiSearchQuery.trim()) {
      const activeGroup = EMOJI_GROUPS.find(g => g.category === activeEmojiTab);
      return activeGroup ? activeGroup.emojis : [];
    }
    const query = inputEmojiSearchQuery.toLowerCase();
    const matched: string[] = [];
    
    EMOJI_GROUPS.forEach(group => {
      group.emojis.forEach(emoji => {
        const keywords = EMOJI_NAMES[emoji] || '';
        if (emoji.includes(query) || keywords.toLowerCase().includes(query)) {
          matched.push(emoji);
        }
      });
    });
    
    return matched;
  };

  const filteredEmojis = getFilteredEmojis();

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-[#0e1621] md:rounded-2xl md:border md:border-[#1c2a38] md:shadow-2xl overflow-hidden font-sans text-slate-100">
      
      {/* Telegram Group Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#17212b] border-b border-[#101921] shrink-0">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setShowGroupInfo(!showGroupInfo)}>
          {/* Telegram-style Circular Group Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
            XG
          </div>
          <div className="text-left">
            <h3 className="font-extrabold text-[14px] leading-tight text-white flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              XENA Shareholder Lounge
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-[#7f91a4] font-medium mt-0.5">
              {uniqueParticipantsCount} members • <span className="text-emerald-400 font-semibold">4 online</span>
            </p>
          </div>
        </div>

        {/* Header Options */}
        <div className="flex items-center gap-1">
          {/* Search trigger */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showSearch ? 'bg-[#202b36] text-blue-400' : 'text-[#7f91a4] hover:bg-[#202b36] hover:text-white'
            }`}
            title="Search Messages"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-full transition-colors cursor-pointer text-[#7f91a4] hover:bg-[#202b36] hover:text-white`}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-blue-400" /> : <VolumeX className="w-4.5 h-4.5 text-slate-500" />}
          </button>

          {/* System Announcement Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-full transition-colors relative cursor-pointer ${
                showNotifications ? 'bg-[#202b36] text-blue-400' : 'text-[#7f91a4] hover:bg-[#202b36] hover:text-white'
              }`}
              title="System Board"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </button>

            {/* Notification Popover Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-[#17212b] border border-[#24313f] rounded-xl shadow-2xl z-50 overflow-hidden p-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#202b36] pb-2.5 mb-3">
                      <div className="flex items-center gap-1.5 text-white font-black text-[11px] uppercase tracking-wider">
                        <Megaphone className="w-4 h-4 text-blue-400" /> pinned announcements
                      </div>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-[#7f91a4] hover:text-white hover:bg-[#202b36] rounded transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      {announcements.map((ann) => (
                        <div 
                          key={ann.id} 
                          className="p-2.5 bg-[#101921] border border-[#202b36] rounded-lg text-left hover:border-blue-500/20 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <strong className="text-[10px] text-white font-bold">{ann.title}</strong>
                            <span className="text-[8px] text-[#7f91a4] font-mono shrink-0">{ann.time}</span>
                          </div>
                          <p className="text-[9.5px] text-slate-300 leading-normal font-semibold">{ann.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Group Details Toggle */}
          <button
            onClick={() => setShowGroupInfo(!showGroupInfo)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showGroupInfo ? 'bg-[#202b36] text-blue-400' : 'text-[#7f91a4] hover:bg-[#202b36] hover:text-white'
            }`}
            title="Group Info"
          >
            <Info className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Search Bar Slide-down */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#17212b] px-4 py-2 border-b border-[#101921] flex items-center gap-2 overflow-hidden shrink-0"
          >
            <Search className="w-4 h-4 text-[#7f91a4] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="flex-1 bg-transparent border-none text-[12.5px] outline-none text-slate-100 placeholder-[#7f91a4] py-1"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-[#202b36] rounded text-[#7f91a4] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Telegram Chat Wallpaper Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none z-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="telegram-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40 L40 0 M0 0 L40 40" fill="none" stroke="#fff" strokeWidth="1"/>
                <circle cx="20" cy="20" r="3" fill="#fff"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#telegram-grid)" />
          </svg>
        </div>

        {/* Left Column: Telegram Conversation Feed */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          
          {/* Messages Stream container */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3.5 flex flex-col bg-[#0e1621] scrollbar-thin scrollbar-thumb-[#24313f] scrollbar-track-transparent">
            {filteredMessages.length === 0 ? (
              <div className="my-auto text-center py-10 space-y-3 px-6">
                <div className="w-14 h-14 rounded-full bg-[#17212b] border border-[#202b36] flex items-center justify-center mx-auto text-blue-400">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white text-sm font-bold">
                    {searchQuery ? 'No matching messages found' : 'No messages here yet'}
                  </h4>
                  <p className="text-[11.5px] text-[#7f91a4] max-w-xs mx-auto">
                    {searchQuery 
                      ? 'Try refining your search terms or keywords.' 
                      : 'Send a message to start conversing with Lafarge Africa Option shareholders.'}
                  </p>
                </div>
              </div>
            ) : (
              filteredMessages.map((msg, index) => {
                const isMe = (msg.senderEmail || '').toLowerCase() === (wallet?.email || '').toLowerCase();
                const isSystem = msg.senderUid === 'XENA-SYSTEM';
                
                // Group consecutive messages from same sender for clean Telegram-style look
                const prevMsg = index > 0 ? filteredMessages[index - 1] : null;
                const isSameSender = prevMsg && prevMsg.senderEmail === msg.senderEmail && (msg.timestamp - prevMsg.timestamp < 180000); // 3 mins threshold
                
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] transition-all group ${
                      isMe ? 'self-end flex-row-reverse' : 'self-start'
                    } ${isSameSender ? 'mt-1' : 'mt-4'}`}
                  >
                    {/* Circle Avatar - hide if consecutive sender to mimic Telegram */}
                    {!isMe && (
                      <div className="w-8 h-8 shrink-0 select-none">
                        {!isSameSender ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-sm ${
                            isSystem 
                              ? 'bg-gradient-to-tr from-[#17212b] to-[#2b5278] border border-blue-500/20 text-blue-300'
                              : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-slate-100'
                          }`}>
                            {isSystem ? 'SYS' : msg.senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    )}

                    {/* Telegram Bubble Wrapper */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      
                      {/* Message Bubble */}
                      <div className={`relative px-3.5 py-2 rounded-2xl transition-all text-left border shadow-sm ${
                        isMe 
                          ? 'bg-[#2b5278] border-[#204060] text-white rounded-br-none' 
                          : 'bg-[#182533] border-[#1f2d3d] text-slate-100 rounded-bl-none'
                      }`}>
                        
                        {/* Telegram Sender Colored Name (Only for others and first message in block) */}
                        {!isMe && !isSameSender && (
                          <div className="flex items-center gap-1.5 mb-1 select-none">
                            <span className={`text-[12px] font-bold ${getSenderColor(msg.senderUid)}`}>
                              {msg.senderName}
                            </span>
                            <span className="font-mono text-[#7f91a4] font-bold text-[8.5px] bg-[#101921] px-1 py-0.2 rounded leading-none border border-[#1f2d3d]">
                              {msg.senderUid}
                            </span>
                            {isSystem && (
                              <span className="text-[7px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 rounded uppercase font-bold tracking-widest font-mono">
                                Admin
                              </span>
                            )}
                          </div>
                        )}

                        {/* Text flow with responsive spacing for the inline timestamp */}
                        <div className="text-[12.5px] leading-relaxed break-words font-medium whitespace-pre-wrap select-all pr-8">
                          {msg.text}
                        </div>

                        {/* Integrated inline timestamp in the bottom-right of bubble */}
                        <div className="absolute bottom-1 right-2 flex items-center gap-1 select-none pointer-events-none">
                          <span className={`text-[8.5px] font-mono leading-none ${
                            isMe ? 'text-blue-200/80' : 'text-[#7f91a4]'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 stroke-[3]" />
                          )}
                        </div>

                        {/* Telegram-style Reactions list overlaying bubble slightly */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(msg.reactions).map(([emoji, users]) => {
                              if (!users || users.length === 0) return null;
                              const hasReacted = users.includes(wallet.email.toLowerCase());
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => onToggleReaction?.(msg.id, emoji)}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold transition-all border cursor-pointer ${
                                    hasReacted
                                      ? 'bg-blue-500/30 border-blue-400/40 text-white shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                                      : 'bg-[#101921] border-[#1c2a38] text-slate-300 hover:border-[#2b5278]'
                                  }`}
                                  title={`${users.length} person(s) reacted`}
                                >
                                  <span>{emoji}</span>
                                  <span className="font-mono text-[9px] opacity-80">{users.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Message Controls (Deletions) */}
                        {((isAdmin && !isSystem) || (isMe && !isSystem)) && onClearMessage && (
                          <button
                            onClick={() => onClearMessage(msg.id)}
                            className="absolute -top-2.5 -right-2.5 p-1 bg-[#17212b] hover:bg-red-950 text-[#7f91a4] hover:text-red-400 border border-[#202b36] hover:border-red-900 rounded-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Micro reaction picker bar shown on hover/click */}
                      <div className="mt-1 flex items-center gap-2 select-none relative">
                        {/* Compact Smile triggers inline popover */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActivePickerId(activePickerId === msg.id ? null : msg.id)}
                            className="p-1 text-[#7f91a4] hover:text-blue-400 rounded transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            title="React"
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Picker Popover */}
                          {activePickerId === msg.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setActivePickerId(null)} 
                              />
                              <div className={`absolute bottom-full mb-1.5 z-50 bg-[#17212b] border border-[#24313f] rounded-full p-1.5 shadow-2xl flex items-center gap-1.5 animate-fade-in ${
                                isMe ? 'right-0' : 'left-0'
                              }`}>
                                {['👍', '❤️', '🔥', '👏', '😂', '🚀', '💸', '💯', '🎉', '💡'].map((emoji) => {
                                  const users = msg.reactions?.[emoji] || [];
                                  const hasReacted = users.includes(wallet.email.toLowerCase());
                                  return (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => handleQuickReaction(msg.id, emoji)}
                                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm transition-transform hover:scale-130 cursor-pointer ${
                                        hasReacted ? 'bg-[#2b5278] text-white' : 'hover:bg-[#202b36]'
                                      }`}
                                    >
                                      {emoji}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Telegram-style Input Form panel */}
          <div className="px-4 py-3 bg-[#17212b] border-t border-[#101921] shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
              
              {/* Attachment Clip */}
              <button
                type="button"
                className="p-2.5 text-[#7f91a4] hover:text-white rounded-full hover:bg-[#202b36] transition-colors cursor-pointer shrink-0"
                title="Files or Media"
                onClick={() => alert('Secure file uploads are subject to supervisor node confirmation.')}
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Message Rounded Input container */}
              <div className="flex-1 flex items-center bg-[#101921] border border-[#24313f] rounded-2xl px-3.5 py-1.5 relative shadow-inner">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full bg-transparent border-none text-[13px] text-white placeholder-[#7f91a4] outline-none pr-10 font-medium py-1"
                  maxLength={400}
                />
                
                {/* Embedded Emoji Picker Trigger Button */}
                <div className="absolute right-3.5 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowInputEmojiPicker(!showInputEmojiPicker)}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      showInputEmojiPicker ? 'text-blue-400 bg-blue-500/15' : 'text-[#7f91a4] hover:text-blue-400'
                    }`}
                    title="Choose Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {/* Fully Searchable Emoji Picker Popover */}
                  <AnimatePresence>
                    {showInputEmojiPicker && (
                      <>
                        {/* Overlay backdrop to close */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowInputEmojiPicker(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.95 }}
                          className="absolute bottom-full right-0 mb-3.5 w-72 sm:w-80 bg-[#17212b] border border-[#24313f] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 overflow-hidden flex flex-col"
                        >
                          {/* Inner Search Box */}
                          <div className="p-2.5 border-b border-[#202b36] flex items-center gap-2 bg-[#101921]">
                            <Search className="w-4 h-4 text-[#7f91a4] shrink-0" />
                            <input
                              type="text"
                              value={inputEmojiSearchQuery}
                              onChange={(e) => setInputEmojiSearchQuery(e.target.value)}
                              placeholder="Search emojis..."
                              className="w-full bg-transparent border-none text-[12px] text-white placeholder-[#7f91a4] outline-none py-0.5"
                            />
                            {inputEmojiSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setInputEmojiSearchQuery('')}
                                className="p-1 hover:bg-[#202b36] rounded text-[#7f91a4]"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Quick Category Tab Navigation */}
                          {!inputEmojiSearchQuery && (
                            <div className="flex border-b border-[#202b36] bg-[#17212b] p-1.5 gap-1 overflow-x-auto scrollbar-none shrink-0">
                              {EMOJI_GROUPS.map((group) => (
                                <button
                                  key={group.category}
                                  type="button"
                                  onClick={() => setActiveEmojiTab(group.category)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                                    activeEmojiTab === group.category
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      : 'text-[#7f91a4] hover:text-white hover:bg-[#202b36] border border-transparent'
                                  }`}
                                >
                                  {group.category}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Scrollable Emojis Grid Area */}
                          <div className="p-3 max-h-48 overflow-y-auto grid grid-cols-8 gap-2 bg-[#0e1621] scrollbar-thin scrollbar-thumb-[#24313f]">
                            {filteredEmojis.length === 0 ? (
                              <div className="col-span-8 text-center text-[11px] text-[#7f91a4] py-6 font-medium">
                                No matching emojis found
                              </div>
                            ) : (
                              filteredEmojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => {
                                    setInputText(prev => prev + emoji);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center text-lg rounded-lg hover:bg-[#202b36] transition-transform active:scale-90 cursor-pointer"
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))
                            )}
                          </div>

                          {/* Submitting Footer Panel */}
                          <div className="p-2 border-t border-[#202b36] bg-[#17212b] flex items-center justify-between text-[11px] text-[#7f91a4] font-medium shrink-0">
                            <span>Tap to add multiple emojis</span>
                            <button
                              type="button"
                              onClick={() => setShowInputEmojiPicker(false)}
                              className="text-blue-400 hover:text-blue-300 font-bold transition-colors cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Circular Telegram Floating Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-[#2481cc] hover:bg-[#2a8fdf] disabled:bg-[#1c2732] disabled:text-[#4f5d6c] text-white flex items-center justify-center transition-all shadow-md shrink-0 active:scale-90 cursor-pointer disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send className="w-4.5 h-4.5 transform rotate-0" />
              </button>

            </form>
          </div>

        </div>

        {/* Right Column: Collapsible Telegram Group Info Panel */}
        <AnimatePresence>
          {showGroupInfo && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:flex flex-col h-full bg-[#17212b] border-l border-[#101921] overflow-hidden shrink-0 text-left"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-[#202b36] flex items-center justify-between shrink-0">
                <h4 className="font-bold text-[13px] text-white uppercase tracking-wider">Group Info</h4>
                <button 
                  onClick={() => setShowGroupInfo(false)}
                  className="p-1 hover:bg-[#202b36] rounded text-[#7f91a4] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Scrollable Content */}
              <div className="p-4 space-y-5 overflow-y-auto flex-1 text-[12px] leading-relaxed scrollbar-thin">
                
                {/* Telegram aesthetic avatar banner */}
                <div className="text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white text-2xl shadow-lg mx-auto mb-3">
                    XG
                  </div>
                  <h4 className="font-bold text-sm text-white">XENA Shareholder Lobby</h4>
                  <p className="text-[11px] text-[#7f91a4] mt-0.5">Corporate Lounge Feed</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#202b36]">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#7f91a4] font-bold tracking-wider block">Description</span>
                    <p className="text-slate-300 font-medium">
                      Encrypted peer-to-peer Lounge active for verification of Lafarge Africa Plc holdings and compound dividend strategies.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-[#7f91a4] font-bold tracking-wider block">Regulations</span>
                    <div className="bg-[#101921] border border-[#202b36] p-2.5 rounded-lg space-y-1.5 text-slate-300 font-medium">
                      <p>• Avoid excessive non-corporate spam</p>
                      <p>• Flag suspicious transfer routing tags</p>
                      <p>• Yield optimization sync runs hourly</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-3 text-center">
                      <span className="text-[9px] text-blue-400 font-bold block uppercase tracking-widest">Shareholder ID</span>
                      <strong className="text-white font-mono text-[11px] block mt-1 select-all">{wallet.uid || 'XENA-49104'}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
