import pandas as pd
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
from app.config import WINDOW_SIZE

def add_smart_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts strict geometry features (Symmetry, Dominance, Slopes)
    and scales pattern metrics using NATR.
    """
    data = df.copy()

    # Ensure column names are standardized to capitalized format
    rename_dict = {col: col.capitalize() for col in data.columns if col.lower() in ['open', 'high', 'low', 'close', 'volume']}
    data.rename(columns=rename_dict, inplace=True)

    # =========================================================================
    # 1. BASE METRICS (ATR & Market Context)
    # =========================================================================
    w_natr = max(5, int(WINDOW_SIZE * 0.28))
    min_dist = max(2, WINDOW_SIZE // 10)

    prev_close = data['Close'].shift(1)
    true_range = pd.concat([
        data['High'] - data['Low'],
        abs(data['High'] - prev_close),
        abs(data['Low'] - prev_close),
    ], axis=1).max(axis=1)
    
    data[f'NATR_{w_natr}'] = true_range.rolling(w_natr).mean() / data['Close']
    data[f'Trend_{WINDOW_SIZE}'] = data['Close'] / data['Close'].shift(WINDOW_SIZE) - 1
    
    min_window = data['Low'].rolling(WINDOW_SIZE).min()
    max_window = data['High'].rolling(WINDOW_SIZE).max()
    data['Range_Position'] = (data['Close'] - min_window) / (max_window - min_window + 1e-8)

    # =========================================================================
    # 2. VECTORIZED EXTREMUM SEARCH (Sliding Windows)
    # =========================================================================
    high_prices = data['High'].values
    low_prices = data['Low'].values

    high_windows = sliding_window_view(high_prices, window_shape=WINDOW_SIZE)
    low_windows = sliding_window_view(low_prices, window_shape=WINDOW_SIZE)
    n_windows = len(high_windows)

    macro_high_indices = np.zeros((n_windows, 3))
    macro_high_prices = np.zeros((n_windows, 3))
    macro_low_indices = np.zeros((n_windows, 3))
    macro_low_prices = np.zeros((n_windows, 3))

    for i in range(n_windows):
        h_win = high_windows[i].copy()
        available_h = np.ones(WINDOW_SIZE, dtype=bool)
        for step in range(3):
            if not np.any(available_h):
                break
            idx = np.argmax(np.where(available_h, h_win, -np.inf))
            macro_high_indices[i, step] = WINDOW_SIZE - idx
            macro_high_prices[i, step] = h_win[idx]
            available_h[max(0, idx - min_dist) : min(WINDOW_SIZE, idx + min_dist + 1)] = False

        l_win = low_windows[i].copy()
        available_l = np.ones(WINDOW_SIZE, dtype=bool)
        for step in range(3):
            if not np.any(available_l):
                break
            idx = np.argmin(np.where(available_l, l_win, np.inf))
            macro_low_indices[i, step] = WINDOW_SIZE - idx
            macro_low_prices[i, step] = l_win[idx]
            available_l[max(0, idx - min_dist) : min(WINDOW_SIZE, idx + min_dist + 1)] = False

    # =========================================================================
    # 3. CHRONOLOGICAL SORT (Left to Right)
    # =========================================================================
    sort_idx_h = np.argsort(-macro_high_indices, axis=1)
    macro_high_indices = np.take_along_axis(macro_high_indices, sort_idx_h, axis=1)
    macro_high_prices = np.take_along_axis(macro_high_prices, sort_idx_h, axis=1)

    sort_idx_l = np.argsort(-macro_low_indices, axis=1)
    macro_low_indices = np.take_along_axis(macro_low_indices, sort_idx_l, axis=1)
    macro_low_prices = np.take_along_axis(macro_low_prices, sort_idx_l, axis=1)

    # =========================================================================
    # 4. ATR-SCALED COORDINATE COMPUTATION
    # =========================================================================
    data = data.iloc[WINDOW_SIZE - 1:].copy()
    current_closes = data['Close'].values
    current_atr_usd = data[f'NATR_{w_natr}'].values * current_closes + 1e-8

    for step in range(3):
        data[f'H_Idx_{step+1}'] = macro_high_indices[:, step].astype(int)
        data[f'L_Idx_{step+1}'] = macro_low_indices[:, step].astype(int)
        data[f'H_Prc_{step+1}'] = (macro_high_prices[:, step] - current_closes) / current_atr_usd
        data[f'L_Prc_{step+1}'] = (current_closes - macro_low_prices[:, step]) / current_atr_usd

    # =========================================================================
    # 5. GEOMETRIC FEATURES FOR XGBOOST
    # =========================================================================
    data['Width_Left_H'] = data['H_Idx_1'] - data['H_Idx_2']
    data['Width_Right_H'] = data['H_Idx_2'] - data['H_Idx_3']
    data['Width_Left_L'] = data['L_Idx_1'] - data['L_Idx_2']
    data['Width_Right_L'] = data['L_Idx_2'] - data['L_Idx_3']

    data['Time_Sym_Classic'] = abs(data['Width_Left_H'] - data['Width_Right_H']) / (data['Width_Left_H'] + data['Width_Right_H'] + 1e-8)
    data['Time_Sym_Inv'] = abs(data['Width_Left_L'] - data['Width_Right_L']) / (data['Width_Left_L'] + data['Width_Right_L'] + 1e-8)

    data['Head_Dom_Classic'] = data['H_Prc_2'] - data[['H_Prc_1', 'H_Prc_3']].max(axis=1)
    data['Shoulder_Sym_Classic'] = abs(data['H_Prc_1'] - data['H_Prc_3'])
    data['Neck_Slope_Classic'] = (data['L_Prc_2'] - data['L_Prc_1']) / (data['Width_Left_L'] + 1e-8)

    data['Head_Dom_Inv'] = data['L_Prc_2'] - data[['L_Prc_1', 'L_Prc_3']].max(axis=1)
    data['Shoulder_Sym_Inv'] = abs(data['L_Prc_1'] - data['L_Prc_3'])
    data['Neck_Slope_Inv'] = (data['H_Prc_2'] - data['H_Prc_1']) / (data['Width_Left_H'] + 1e-8)

    # =========================================================================
    # 6. FEATURE CLEANUP (DROPPING RAW COLUMNS)
    # =========================================================================
    cols_to_drop = ['Open', 'High', 'Low', 'Close', 'Volume', 'head_shoulder_format', 'Target']
    for step in range(3):
        cols_to_drop.extend([f'H_Idx_{step+1}', f'L_Idx_{step+1}'])
    cols_to_drop.extend(['H_Prc_1', 'H_Prc_3', 'L_Prc_1', 'L_Prc_3'])

    data.drop(columns=[c for c in cols_to_drop if c in data.columns], inplace=True)
    data.dropna(inplace=True)

    return data