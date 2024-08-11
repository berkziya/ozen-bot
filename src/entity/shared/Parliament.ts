import { Player } from '../Player';
import { Region } from '../Region';

export class Law {
  id!: number;
  by!: Player;
  text!: string;
  proposeDate: Date | null = null;
  pro: Set<Player> = new Set();
  contra: Set<Player> = new Set();
}

export class Parliament {
  capitalRegion!: Region;
  isAutonomy!: boolean;
  laws: Law[] = [];
}
