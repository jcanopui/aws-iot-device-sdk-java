package es.everis.innotech2017.iot;

import com.amazonaws.services.iot.client.AWSIotException;
import com.amazonaws.services.iot.client.AWSIotTimeoutException;
import com.fazecast.jSerialComm.SerialPort;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by dvilaspe on 15/06/2017.
 */
public class Main {
    private static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

    public static void main(String args[]) throws AWSIotException, AWSIotTimeoutException {
        SerialPort  port = null;
        while(port==null)port=choosePort();

        System.out.println("Port Choosed: "+port.getSystemPortName());
        port.setBaudRate(57600);
        port.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING,2000,0);
        port.openPort();

        System.setProperty("https.proxyHost","10.121.8.100");
        System.setProperty("https.proxyPort","8800");

        AwsClient client = new AwsClient();
        BufferedReader portReader= new BufferedReader(new InputStreamReader(port.getInputStream()));
        while(port.isOpen()){
            String line = null;
            try {
                line = portReader.readLine();
                String lux = line.substring(line.lastIndexOf(" ")+1);
                System.out.println(lux );
                client.sendLux(lux);
            } catch (IOException e) {
                e.printStackTrace();
            }
            //System.out.println(line);
        }
    }
    private static SerialPort choosePort(){
        System.out.println("Choose port");
        SerialPort[] ports = SerialPort.getCommPorts();
        for(int i=0;i<ports.length;i++){
            SerialPort s = ports[i];
            System.out.println("  "+i+": "+s.getSystemPortName());
        }
        try{
            int i = Integer.parseInt(br.readLine());
            if(1<0)System.exit(0);
            if(i<ports.length)return ports[i];
        }catch(NumberFormatException nfe){
            System.err.println("Invalid Format!");
        }catch (IOException nfe){

        }
        return null;
    }
}
