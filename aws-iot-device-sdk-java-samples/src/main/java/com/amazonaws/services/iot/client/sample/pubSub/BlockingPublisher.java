package com.amazonaws.services.iot.client.sample.pubSub;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.amazonaws.services.iot.client.AWSIotException;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.sample.pubSub.entities.RapsBerryData;
import com.amazonaws.services.iot.client.sample.pubSub.entities.ThingSensorData;

public class BlockingPublisher implements Runnable {
	
	public static long globalAccount = 0;
	
    private final AWSIotMqttClient awsIotClient;

    private String topic;
    
    private RapsBerryData rapsBerryData = null;
    
    private int numRapsBerry = 0;
    private int numThingsByRapsBerry = 0;
    
    private static Random randomValueGenerator;
    
    public BlockingPublisher(AWSIotMqttClient awsIotClient, String pTopic, 
    		int pNumRapsBerry, int pNumThingsByRapsBerry) {
    	
        this.awsIotClient = awsIotClient;
        this.topic = pTopic;
        this.numRapsBerry= pNumRapsBerry;
        this.numThingsByRapsBerry = pNumThingsByRapsBerry;
        this.randomValueGenerator = new Random();
    }


	private void initThings(int idRapsBerry, int numThings) {

		List<ThingSensorData> thingList = new ArrayList<ThingSensorData>();
		rapsBerryData = new RapsBerryData();
		
		rapsBerryData.setRasBerryId("RAPSBERRY-"+idRapsBerry);
		rapsBerryData.setDate(new Date());
		
//		for (int i = 0; i < numThings; i++) {
//			ThingSensorData thing = new ThingSensorData("THING-"+i, new Date(), randomValueGenerator.nextInt(2000));
//			thingList.add(thing);
//		}

		ThingSensorData thing1 = new ThingSensorData("THING-1", new Date(), randomValueGenerator.nextInt(2000));
		rapsBerryData.setThing1(thing1);
		ThingSensorData thing2 = new ThingSensorData("THING-2", new Date(), randomValueGenerator.nextInt(2000));
		rapsBerryData.setThing2(thing1);
		
//		rapsBerryData.setItems(thingList);
	}

	private void updateRapsBerryData(RapsBerryData rapsBerryData) {
		
		rapsBerryData.setPrivateId(globalAccount++);
		rapsBerryData.setDate(new Date());
		
//		for (ThingSensorData thing : rapsBerryData.getItems()) {
//			thing.setDate(new Date());
//			thing.setValue(randomValueGenerator.nextInt(2000));
//		}
		
		rapsBerryData.getThing1().setDate(new Date());
		rapsBerryData.getThing1().setValue(randomValueGenerator.nextInt(2000));
		
		rapsBerryData.getThing2().setDate(new Date());
		rapsBerryData.getThing2().setValue(randomValueGenerator.nextInt(2000));
		
	}
	
    @Override
    public void run() {
        
        initThings(numRapsBerry, numThingsByRapsBerry);
        
        while (true) {
        	updateRapsBerryData(rapsBerryData);
            String payload = rapsBerryData.writelog();//"hello from blocking publisher - " + (counter++);
            try {
                awsIotClient.publish(topic, payload);
            } catch (AWSIotException e) {
                System.out.println(System.currentTimeMillis() + ": publish failed for " + payload);
            }
            System.out.println(System.currentTimeMillis() + ": >>> " + payload);

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println(System.currentTimeMillis() + ": BlockingPublisher was interrupted");
                return;
            }
        }
    }

}
