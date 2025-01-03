import pino from "pino";


export const loggerhttp = pino({
    transport:{
      target:"pino-http-print",
      options:{
        destination:1,
        all:true,
        translateTime: 'SYS:HH:MM:ss dd-mm-yyyy',
        ignore:"pid,hostname",
      }
    }
  })

const logger = pino({
    transport:{
        target:'pino-pretty',
        options:{
            translateTime:'SYS:HH:MM:ss dd-mm-yyyy',
            ignore:"pid,hostname",
        }
    }
});

export default logger;