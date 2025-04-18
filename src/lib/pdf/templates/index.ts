
import { template1 } from './template1';
import { template2 } from './template2';
import { template3 } from './template3';

export const pdfTemplates = {
  template1,
  template2,
  template3,
};

export const defaultPdfTemplate = {
  html: pdfTemplates.template1
};
