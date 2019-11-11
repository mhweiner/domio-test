import sendFakeEmail from './services/fakeEmailService';

/* all of the different actions can go here, like email, sms, push, etc. */

export function sendEmail(to, subject, message) {

  sendFakeEmail(to, subject, message);

}