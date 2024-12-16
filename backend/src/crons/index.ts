import logger from "../middleware/logger";
import autoCancelCron from "./autoCancelBookingCron";
import pickupremainderCron from "./pickupRemainderCron";


const initializeCrons = () => {
    logger.info('Initializing Cron Jobs...')
    pickupremainderCron();
    autoCancelCron();
}

export default initializeCrons;