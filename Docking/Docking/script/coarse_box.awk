BEGIN { 
	letrs[1] = "x"; letrs[2] = "y"; letrs[3] = "z"
	"awk 'BEGIN { FS = \", \" } NR == 2 { print $11 }'\
	< output/receptor.pdbqt_predictions.csv" | getline atom_string
	min[1] = 9000; min[2] = 9000; min[3] = 9000 
	max[1] = -9000; max[2] = -9000; max[3] = -9000 
	scaling = 1.1
	n = split(atom_string, atoms, " ")
	j = 1
}

/^ATOM/ && $2 == atoms[j] {
	for (i in letrs) {
		coords[i] = $(6+i) #x = coords[1] = $7 and so on
		max[i] = (coords[i] > max[i]) ? coords[i] : max[i]
		min[i] = (coords[i] < min[i]) ? coords[i] : min[i]
	} 
	j++
}

END {
	for (i in letrs) {
		center[i] = (max[i] + min[i]) / 2
		size[i] = (max[i] - min[i]) * scaling
		printf("center_%s = %.3f\n", letrs[i], center[i])
		printf("size_%s = %.1f\n", letrs[i], size[i])
	}
}
