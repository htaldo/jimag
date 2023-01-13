BEGIN { min[1] = 6000; min[2] = 6000; min[3] = 6000 }

/^M|^A/{
	if ( NR == 1 ) next #pass by the first MODEL line with next
	if ( $1 ~ /^A/ ) {
		for (i = 1; i < 4; i++)	{
			coords[i] = $(6+i) #x = coords[1] = $7 and so on
			max[i] = (coords[i] > max[i]) ? coords[i] : max[i]
			min[i] = (coords[i] < min[i]) ? coords[i] : min[i]
		}
		next #keep extracting coordinates until MODEL or EOF
	} 
	box(max, min)
}

END {box(max, min)}

function box (max, min) {
	for ( i = 1; i < 4; i++ ) {
		center[i] = (max[i] + min[i]) / 2
		size[i] = max[i] - min[i]
	}
	printf("center_x = %.3f\n", center[1])
	printf("center_y = %.3f\n", center[2])
	printf("center_z = %.3f\n", center[3])
	printf("size_x = %.1f\n", size[1])
	printf("size_y = %.1f\n", size[2])
	printf("size_z = %.1f\n\n", size[3])
	#¿podré escribir el config en el orden center, size, center ...?
	#si es así puedo meter los printf en un loop
}
