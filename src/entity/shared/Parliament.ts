import { Player } from '../Player';
import { Region } from '../Region';

export class Law {
  id: number = 0;
  by: Player | null = null;
  text: string = '';
  proposedAt: Date | null = null;
  pro: Set<Player> = new Set();
  contra: Set<Player> = new Set();
}

export class Parliament {
  capitalRegion: Region | null = null;
  isAutonomy = false;
  laws: Law[] = [];
}
