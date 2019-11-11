import log from 'roarr';

export default function sendFakeEmail(to, subject, body) {

  /* pretending to send email here... would utilize preferred email service via API...(ie, Mailgun, Sendgrid, etc) */

  log.info({
    to: to,
    subject: subject,
    body: body
  }, 'EMAIL_SENT');

}