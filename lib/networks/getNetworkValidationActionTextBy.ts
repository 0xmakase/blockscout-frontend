import config from 'configs/app';

export default function getNetworkValidationActionTextBy() {
  switch (config.chain.verificationType) {
    case 'validation': {
      return 'blockDetails.validatedBy';
    }
    case 'mining': {
      return 'blockDetails.minedBy';
    }
    case 'posting': {
      return 'blockDetails.postedBy';
    }
    case 'sequencing': {
      return 'blockDetails.sequencedBy';
    }
    default: {
      return 'blockDetails.minedBy';
    }
  }
}
