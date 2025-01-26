import { Region } from '../../../entity/Region';
import { User } from '../../../user/User';
export declare function cancelMove(user: User): Promise<Response>;
export declare function moveTo(user: User, region: Region, fast?: boolean): Promise<Response>;
export declare function buildMilitaryAcademy(user: User): Promise<Response>;
