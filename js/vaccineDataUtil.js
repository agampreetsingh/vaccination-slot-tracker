function LinkFormatter(value) {
    return "<a href='" + value + "' target='_blank'>View Map</a>";
}

function VaccineFeesFormatter(value) {
    if (value) {
        value.push(value[0])
        val = "";
        value.forEach((vaccineFee) => {
            val += vaccineFee.vaccine + " - " + vaccineFee.fee + "\n";
        });
        return val;
    }
    else
        return "Free";
}

$("#table").bootstrapTable({
    data: [],
    autoRefresh: true,
});