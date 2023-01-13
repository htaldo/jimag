BEGIN { 
	WD = "/home/arturo/proyectoAF/app2/script/output/redock"
	letrs[1] = "x"; letrs[2] = "y"; letrs[3] = "z"
	min[1] = 6000; min[2] = 6000; min[3] = 6000 
	scaling = 1.5
}

/^M/ { model_n = $2 }

/VINA/ { select[model_n] = is_new_rmsd($5, select) }

{ 
	if (select[model_n]) {
		OF = WD "/" model_n ".box"
		system("touch "OF"")
	}
	else next 
}

/^A/ {
	for (i in letrs) {
		coords[i] = $(6+i) #x = coords[1] = $7 and so on
		max[i] = (coords[i] > max[i]) ? coords[i] : max[i]
		min[i] = (coords[i] < min[i]) ? coords[i] : min[i]
	}
}

/^ENDMDL/ {
	for (i in letrs) {
		center[i] = (max[i] + min[i]) / 2
		size[i] = (max[i] - min[i]) * scaling
		printf("center_%s = %.3f\n", letrs[i], center[i]) > OF
		printf("size_%s = %.1f\n", letrs[i], size[i]) > OF
	}
	close(OF) 
}



function is_new_rmsd(value, rmsds) {
	printf("analysing value %f\n", value) #DEBUG
	if (value == 0) return 1 #the best model would have rmsd = 0
	else if (value > 5) {
		printf("new rmsd found: %f\n", value) #DEBUG
		for (rmsd in rmsds) {
			diff = value - rmsd
			if (diff > -3 && diff < 3) return 0 #abs(diff) < 3
		}
		return value
	}
}
