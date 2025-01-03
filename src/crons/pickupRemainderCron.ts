import cron from 'node-cron'
import PickupService from '../services/PickupService';
import PickupRepository from '../repositories/PickupRepository';
import Pickups from '../models/Pickups';
import { sendPickupConfirmEmail } from '../utils/emailService';
import logger from '../middleware/logger';

const pickupService = new PickupService(new PickupRepository(Pickups))

const pickupremainderCron = () => {
    cron.schedule('0,30 8-19 * * 1-6',async()=>{
        const pickups = await pickupService.getUpcomingPickups(30);
        if(pickups){            
            for(const pickup of pickups){
                await sendPickupConfirmEmail({
                    email:pickup.userDetails.email,
                    username:pickup.userDetails.firstName,
                    address:pickup.locationdetails?.description,
                    time:pickup.shedule.time,
                    date:pickup.shedule.date
                })
            }
        }
        logger.info('sheduled pickup remainder email send by Cron Jobs')
    })
}

export default pickupremainderCron;