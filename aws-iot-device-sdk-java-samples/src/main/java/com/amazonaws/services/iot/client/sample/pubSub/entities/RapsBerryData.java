package com.amazonaws.services.iot.client.sample.pubSub.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RapsBerryData {
	
	private long privateId;
	private String rasBerryId;
//	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm a z")
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd'T'HH:mm:ss.SSSZ", timezone="Europe/Madrid")
	private Date date;
	private List<ThingSensorData> items;
	
	
	public RapsBerryData() {
		super();
		privateId = 0;
		items = new ArrayList<ThingSensorData>(); 
	}
	

	public String writelog() {
		String result = "";
		ObjectMapper mapper = new ObjectMapper();
		
		//Object to JSON in String
		try {
			result = mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			System.out.println(System.currentTimeMillis() + e.getMessage());
		}
		return result;
	}
	
	public String getRasBerryId() {
		return rasBerryId;
	}


	public void setRasBerryId(String rasBerryId) {
		this.rasBerryId = rasBerryId;
	}


	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}

	public List<ThingSensorData> getItems() {
		return items;
	}
	public void setItems(List<ThingSensorData> items) {
		this.items = items;
	}

	public long getPrivateId() {
		return privateId;
	}


	public void setPrivateId(long privateId) {
		this.privateId = privateId;
	}
	
}
