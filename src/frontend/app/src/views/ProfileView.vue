<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-5">
                <div class="profileImg border-online">
				</div>
            </div>
            <div class="col-md-7">
                <h2>Username</h2>
				<hr class="profileDivider">
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>
            </div>
        </div>
    </div>
</template>


<style>

.profileImg{
  background: #f0f0f0 url("@/assets/profileplaceholder.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 400px;
  width: 400px;
  border: solid;
  border-width: 3px;
}

.profileDivider {
	border-top: 5px solid #bbb;
	border-radius: 5px;
}

.border-offline {
	border-color: #000000;
}
.border-online {
	border-color: #25af2df3;
}
.border-ingame {
	border-color: #ff8e00;
}

</style>