package com.rippleofchange.api.dto;

import com.rippleofchange.api.model.Severity;
import lombok.Data;

@Data
public class HotspotRequest {
    private Double latitude;
    private Double longitude;
//    private Severity severity;
    // We don't put the image file here
    // It will be handled as a MultipartFile in the controller
}