package com.amazonaws.services.iot.client.sample.pubSub;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.amazonaws.services.iot.client.AWSIotException;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.sample.pubSub.entities.RapsBerryData;
import com.amazonaws.services.iot.client.sample.pubSub.entities.ThingData;

public class BlockingPublisher implements Runnable {
	
    private final AWSIotMqttClient awsIotClient;

    private String topic;
    
    private RapsBerryData rapsBerryData = null;
    
    private int numRapsBerry = 0;
    private int numThingsByRapsBerry = 0;
    
    public BlockingPublisher(AWSIotMqttClient awsIotClient, String pTopic, 
    		int pNumRapsBerry, int pNumThingsByRapsBerry) {
    	
        this.awsIotClient = awsIotClient;
        this.topic = pTopic;
        this.numRapsBerry= pNumRapsBerry;
        this.numThingsByRapsBerry = pNumThingsByRapsBerry;
    }


	private void initThings(int idRapsBerry, int numThings) {

		List<ThingData> thingList = new ArrayList<ThingData>();
		rapsBerryData = new RapsBerryData();
		
		rapsBerryData.setId("RAPSBERRY-"+idRapsBerry);
		rapsBerryData.setDate(new Date());
		rapsBerryData.setLight(new Random().nextInt());
		rapsBerryData.setValue(new Random().nextInt());
		
		for (int i = 0; i < numThings; i++) {
			ThingData thing = new ThingData("THING-"+i, new Date(), new Random().nextInt());
			thingList.add(thing);
		}

		rapsBerryData.setItems(thingList);
	}
	
    @Override
    public void run() {
        
        initThings(numRapsBerry, numThingsByRapsBerry);
        
        while (true) {
        	
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
