import freshOyster from '../assets/fresh oyester mushroom.png';
import dryOyster from '../assets/dry oyester mushroom.png';
import mushroomPowder from '../assets/mushroom powder.png';
import oysterSpawn from '../assets/oyester mushroom spawn.png';
import readyToEat from '../assets/ready to eat fresh.png';
import onlineTraining from '../assets/online training.png';
import offlineTraining from '../assets/offline training.png';

export const productImages = {
  freshOyster,
  dryOyster,
  mushroomPowder,
  oysterSpawn,
  readyToEat,
} as const;

export const trainingImages = {
  online: onlineTraining,
  offline: offlineTraining,
} as const;
