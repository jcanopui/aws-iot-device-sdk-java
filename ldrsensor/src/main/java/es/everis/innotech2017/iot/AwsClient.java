package es.everis.innotech2017.iot;

import com.amazonaws.services.iot.client.*;

/**
 * Created by dvilaspe on 15/06/2017.
 */
public class AwsClient {

    private AWSIotMqttClient mqttClient;
    private String zone="ZGZ";

    public AwsClient() throws AWSIotException {
        String awsAccessKeyId=System.getenv("AWS_ACCESS_KEY_ID");
        String awsSecretAccessKey=System.getenv("AWS_SECRET_ACCESS_KEY");
        System.out.println("AWS_ACCESS_KEY_ID: "+awsAccessKeyId);
        System.out.println("AWS_SECRET_ACCESS_KEY: "+awsSecretAccessKey);


        String clientEndpoint = "a37hc7nazelgx0.iot.us-east-1.amazonaws.com";       // replace <prefix> and <region> with your own
        String clientId = "arudinoNanoBridge";                              // replace with your own client ID. Use unique client IDs for concurrent connections.

        // AWS IAM credentials could be retrieved from AWS Cognito, STS, or other secure sources
        mqttClient = new AWSIotMqttClient(clientEndpoint, clientId, awsAccessKeyId, awsSecretAccessKey, null);

        mqttClient.connect();
        TopicListener tl = new TopicListener("$aws/things/ArduinoYunLed/shadow/update/accepted");

        mqttClient.subscribe(tl);
    }

    public void sendLux(String lux) throws AWSIotException, AWSIotTimeoutException {
        String payload = "{\"id\":\"arduinoyunsensor\",\"region\":\""+zone+"\",\"thing1\":{\"id\":\"1\",\"value\":"+lux+"}}";
        mqttClient.publish("topic/LightMeasure/arduinoyunsensor",AWSIotQos.QOS1,payload,1000);
    }

    class TopicListener extends AWSIotTopic{

        public TopicListener(String topic) {
            super(topic, AWSIotQos.QOS1);
        }

        @Override
        public void onMessage(AWSIotMessage message) {
            super.onMessage(message);
            System.out.println(new String(message.getPayload()));
        }
    }
}
