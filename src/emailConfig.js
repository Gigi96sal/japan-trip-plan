// src/emailConfig.js
// Configurazione EmailJS - sostituisci con le tue credenziali
export const EMAIL_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // La tua Public Key di EmailJS
  SERVICE_ID: 'YOUR_SERVICE_ID', // Il tuo Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Il tuo Template ID
  TO_EMAIL: 'desi.ceres@gmail.com' // Email di destinazione (nascosta all'utente)
};

// ISTRUZIONI PER LA CONFIGURAZIONE:
// 1. Vai su https://www.emailjs.com/
// 2. Crea un account gratuito
// 3. Crea un nuovo servizio email (Gmail, Outlook, etc.)
// 4. Crea un template email con le seguenti variabili:
//    - {{from_name}} - Nome dell'utente
//    - {{to_email}} - Email di destinazione (desi.ceres@gmail.com)
//    - {{subject}} - Oggetto dell'email
//    - {{message}} - Contenuto markdown delle preferenze
//    - {{user_name}} - Nome utente
//    - {{category}} - Categoria completata (Tokyo/Kyoto)
// 5. Copia i tuoi ID nelle costanti sopra
// 6. Il template email dovrebbe avere un corpo simile a:
//    Subject: {{subject}}
//    Body: 
//    Ciao,
//    
//    {{from_name}} ha completato le preferenze per {{category}}.
//    
//    Ecco il riepilogo:
//    {{message}}
//    
//    Cordiali saluti,
//    Sistema di Viaggio Giappone