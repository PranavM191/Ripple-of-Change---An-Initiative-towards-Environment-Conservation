package com.rippleofchange.api.dto;

import java.util.List;

public class MLAnalysisResponse {

    private List<String> detected_classes;
    private List<List<Double>> bounding_boxes;
    private int severity_score;
    private double coverage_percent;

    public List<String> getDetected_classes() { return detected_classes; }
    public void setDetected_classes(List<String> detected_classes) { this.detected_classes = detected_classes; }

    public List<List<Double>> getBounding_boxes() { return bounding_boxes; }
    public void setBounding_boxes(List<List<Double>> bounding_boxes) { this.bounding_boxes = bounding_boxes; }

    public int getSeverity_score() { return severity_score; }
    public void setSeverity_score(int severity_score) { this.severity_score = severity_score; }

    public double getCoverage_percent() { return coverage_percent; }
    public void setCoverage_percent(double coverage_percent) { this.coverage_percent = coverage_percent; }
}