package com.uhfcl;

import android.util.Log;

import java.util.ArrayList;
import java.util.List;

import uhf.api.CommandType;
import uhf.api.MultiLableCallBack;
import uhf.api.Multi_query_epc;
import uhf.api.ShareData;

public class UHFdata {
  public int count = 0;
  public List<String> Arr = new ArrayList<String>();

  public List get(){
    Log.i("Статус", "Запущено");
    count = 0;
    MultiLableCallBack mlt = new MultiLableCallBack() {
      @Override
      public void method(char[] data) {
        //Log.i("Длина массива", Integer.toString(Arr.length));
        char msb = data[0];
        char lsb = data[1];
        int pc = (msb & 0x00ff) << 8 | (lsb & 0x00ff);
        pc = (pc & 0xf800) >> 11; //Work out PC
        char[] tmp = new char[pc * 2];
        System.arraycopy(data, 2, tmp, 0, tmp.length);
        String str_tmp = (ShareData.CharToString(tmp, tmp.length)).replaceAll("\\s", "");
        if (Arr.size() == 0) {
          Arr.add(str_tmp);
        } else {
          if (Arr.indexOf(str_tmp) == -1) {
            Arr.add(str_tmp);
          }
        }
        //Log.i("Резуьтат: ", str_tmp);
        count++;
        if (count == 30) {
          Log.i("Длина", Integer.toString(Arr.size()));
          UHFClient.mUHF.command(CommandType.STOP_MULTI_QUERY_TAGS_EPC, null);
        }
      }
    };
    Multi_query_epc mMulti_query_epc = new Multi_query_epc();
    mMulti_query_epc.query_total = 100;

    UHFClient info = UHFClient.getInstance();
    if (info != null) {
      UHFClient.mUHF.setCallBack(mlt);
      UHFClient.mUHF.command(CommandType.MULTI_QUERY_TAGS_EPC, mMulti_query_epc);
    }
    return Arr;
  }
}
