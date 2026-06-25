# Model path config
MODEL_PATH = "models/xgb_hs_detector_MVP1.json"

# Sliding window size used during model training
WINDOW_SIZE = 50

# Post-processing configurations
TOLERANCE_WINDOW = 10  # NMS window size

# Model thresholds based on your business metric optimization
THRESHOLD_CLASSIC_HS = 0.60
THRESHOLD_INVERSE_HS = 0.65

# Strict feature ordering expected by the trained XGBoost model
FEATURE_ORDER = [
    "NATR_14",
    "Trend_50",
    "Range_Position",
    "H_Prc_2",
    "L_Prc_2",
    "Width_Left_H",
    "Width_Right_H",
    "Width_Left_L",
    "Width_Right_L",
    "Time_Sym_Classic",
    "Time_Sym_Inv",
    "Head_Dom_Classic",
    "Shoulder_Sym_Classic",
    "Neck_Slope_Classic",
    "Head_Dom_Inv",
    "Shoulder_Sym_Inv",
    "Neck_Slope_Inv"
]