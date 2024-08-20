import { Player } from '../Player';
import { Region } from '../Region';

export class Law {
  id!: number;
  by!: Player;
  text!: string;
  proposeDate: Date | null = null;
  pro: Set<Player> = new Set();
  contra: Set<Player> = new Set();

  toJSON() {
    return {
      id: this.id,
      by: this.by.id,
      text: this.text,
      proposeDate: this.proposeDate,
      pro: Array.from(this.pro, (x) => x.id),
      contra: Array.from(this.contra, (x) => x.id),
    };
  }
}

export class Parliament {
  capitalRegion!: Region;
  isAutonomy!: boolean;
  laws: Law[] = [];

  toJSON() {
    return {
      capitalRegion: this.capitalRegion.id,
      isAutonomy: this.isAutonomy,
      laws: this.laws,
    };
  }
}
