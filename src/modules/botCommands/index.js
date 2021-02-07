import botCommandStart from './start';
import botCommandHelp from './help';
import botCommandTop10 from './top10';
import botCommandCurrency from './currency';
import botCommandBest1h from './best1h';
import botCommandBest24h from './best24h';
import botCommandBest7d from './best7d';
import botCommandWorst1h from './worst1h';
import botCommandWorst24h from './worst24h';
import botCommandWorst7d from './worst7d';
import botCommandMessagesLogs from './logs';
import botCommandUsers from './users';
import botCommandAbout from './about';

export const botCommandsHandlers = [
  botCommandStart,
  botCommandHelp,
  botCommandTop10,
  botCommandBest1h,
  botCommandBest24h,
  botCommandBest7d,
  botCommandWorst1h,
  botCommandWorst24h,
  botCommandWorst7d,
  botCommandMessagesLogs,
  botCommandUsers,
  botCommandAbout,
  botCommandCurrency,
];
