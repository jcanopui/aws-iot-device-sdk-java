package com.amazonaws.services.iot.client.sample.pubSub.entities;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ThingData {
	
	private String id;
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm a z")
	private Date date;
	private double value;


	public ThingData(String id, Date date, double value) {
		super();
		this.id = id;
		this.date = date;
		this.value = value;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public double getValue() {
		return value;
	}

	public void setValue(double value) {
		this.value = value;
	}

	public ThingData() {
		super();
	}
	
	
}
