package pcap2wav

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}
