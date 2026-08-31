import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FiberNewRoundedIcon from "@mui/icons-material/FiberNewRounded";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";

const kindFor = value => {
    const key = String(value || "").toLowerCase();
    if (key.includes("winning") || key.includes("positive")) return "winning";
    if (key.includes("declining") || key.includes("losing")) return "declining";
    if (key.includes("rank_drop")) return "rankDrop";
    if (key.includes("missing")) return "missing";
    if (key.includes("highest") || key.includes("top")) return "highest";
    if (key.includes("lowest")) return "lowest";
    if (key.includes("new")) return "new";
    return "all";
};

const visual = {
    winning: { color: "#08783f", background: "#e8f7ef", border: "#20a66a", Icon: TrendingUpRoundedIcon },
    declining: { color: "#a65308", background: "#fff1dc", border: "#f59e0b", Icon: TrendingDownRoundedIcon },
    rankDrop: { color: "#be123c", background: "#fff1f2", border: "#e11d48", Icon: KeyboardDoubleArrowDownRoundedIcon },
    missing: { color: "#b42318", background: "#fee8e8", border: "#dc2626", Icon: PersonOffOutlinedIcon },
    highest: { color: "#1d4ed8", background: "#e8f1ff", border: "#2563eb", Icon: EmojiEventsRoundedIcon },
    lowest: { color: "#be123c", background: "#fff1f2", border: "#e11d48", Icon: TrendingDownRoundedIcon },
    new: { color: "#6d28d9", background: "#f3e8ff", border: "#8b5cf6", Icon: FiberNewRoundedIcon },
    all: { color: "#475569", background: "#eef2f7", border: "#64748b", Icon: FormatListBulletedRoundedIcon },
};

const OptionContent = ({ option }) => {
    const style = visual[kindFor(option.value)];
    const Icon = style.Icon;
    return <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, minWidth: 0 }}>
        <Box sx={{ display: "grid", placeItems: "center", width: 28, height: 28, flex: "0 0 28px", borderRadius: "8px", color: style.color, background: style.background }}><Icon sx={{ fontSize: 18 }}/></Box>
        <Box component="span" sx={{ color: style.color, fontWeight: 750, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{option.label}</Box>
    </Box>;
};

const ImpactGroupSelect = ({ value, onChange, options, name, label = "Impact group" }) => {
    const selected = options.find(option => option.value === value) || options[0];
    return <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
            name={name}
            value={value}
            label={label}
            onChange={onChange}
            renderValue={() => selected ? <OptionContent option={selected}/> : ""}
            MenuProps={{ PaperProps: { sx: { mt: .5, borderRadius: "9px", border: "1px solid #d8dee8", boxShadow: "0 12px 28px rgba(15,23,42,.18)", overflow: "hidden" } } }}
            sx={{ "& .MuiSelect-select": { py: .65 }, "& fieldset": { borderColor: visual[kindFor(value)].border }, "&:hover fieldset": { borderColor: `${visual[kindFor(value)].border}!important` } }}
        >
            {options.map(option => {
                const style = visual[kindFor(option.value)];
                return <MenuItem key={option.value} value={option.value} sx={{ minHeight: 46, gap: 1, borderLeft: `4px solid ${style.border}`, "&.Mui-selected": { background: style.background }, "&.Mui-selected:hover, &:hover": { background: style.background } }}>
                    <ListItemIcon sx={{ display: "none" }}/><OptionContent option={option}/>
                </MenuItem>;
            })}
        </Select>
    </FormControl>;
};

export default ImpactGroupSelect;
