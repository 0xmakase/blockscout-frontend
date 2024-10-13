import config from 'configs/app';

export default function getNetworkValidatorTitle() {
  switch (config.chain.verificationType) {
    case 'validation': {
      return 'blocksTable.validator';
    }
    case 'mining': {
      return 'blockDetails.miner';
    }
    case 'posting': {
      return 'blockDetails.poster';
    }
    case 'sequencing': {
      return 'blockDetails.sequencer';
    }
    default: {
      return 'blockDetails.miner';
    }
  }
}
