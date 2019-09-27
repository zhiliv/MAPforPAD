package com.uhfcl;


import jni.Linuxc;
import uhf.api.UHF;
public class UHFClient 
{
	
	public static UHF mUHF;
	private static UHFClient instance = null;
	

	public static UHFClient getInstance() 
	{
		if (instance == null) 
		{
			
			mUHF=new UHF("/dev/ttysWK2",Linuxc.BAUD_RATE_115200,1,0);
			
			
			
			mUHF.com_fd=mUHF.transfer_open(mUHF);
			if(mUHF.com_fd>0)
			{
				instance=new UHFClient();
			}
		}
		return instance;
	}
	
	
	public static void Disconnect()
	{
		if(instance!=null)
		{
			if(mUHF!=null)
			{
				mUHF.transfer_close(mUHF);
				mUHF=null;
			}
			instance=null;
		}
	}
	
	
	

}
