import React from 'react'
import Image from 'next/image'



function DashboardPage() {
  return (
    <section id='dashboard'>
      <main className="h-full overflow-y-auto  max-w-full  pt-4">
        <div className="container full-container py-5 flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6">
            <div className="col-span-2">
              <div className="card">
                <div className="card-body">
                  <div className="sm:flex block justify-between mb-5">
                    <h4 className="text-gray-600 text-lg font-semibold sm:mb-0 mb-2">Practitioner Overview</h4>
                    <select name="cars" id="cars" className=" border-gray-400 text-gray-500 rounded-md text-sm border-[1px] focus:ring-0 sm:w-auto w-full">
                      <option value="volvo">March2023</option>
                      <option value="saab">April2023</option>
                      <option value="mercedes">May2023</option>
                      <option value="audi">June2023</option>
                    </select>
                  </div>
                  <div id="chart"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="text-gray-600 text-lg font-semibold mb-5">Yearly Breakup</h4>
                  <div className="flex gap-6 items-center justify-between">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[21px] font-semibold text-gray-600">$36,358</h3>
                      <div className="flex items-center gap-1">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-400">
                          <i className="ti ti-arrow-up-left text-teal-500"></i>
                        </span>
                        <p className="text-gray-600 text-sm font-normal ">+9%</p>
                        <p className="text-gray-500 text-sm font-normal text-nowrap">last year</p>
                      </div>
                      <div className="flex">
                        <div className="flex gap-2 items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          <p className="text-gray-500 font-normal text-xs">2023</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <p className="text-gray-500 font-normal text-xs">2023</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex  items-center">
                      <div id="breakup"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="flex gap-6 items-center justify-between">
                    <div className="flex flex-col gap-5">
                      <h4 className="text-gray-600 text-lg font-semibold">Monthly Earnings</h4>
                      <div className="flex flex-col gap-[18px]">
                        <h3 className="text-[21px] font-semibold text-gray-600">$6,820</h3>
                        <div className="flex items-center gap-1">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-400">
                            <i className="ti ti-arrow-down-right text-red-500"></i>
                          </span>
                          <p className="text-gray-600 text-sm font-normal ">+9%</p>
                          <p className="text-gray-500 text-sm font-normal">last year</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-11 h-11 flex justify-center items-center rounded-full bg-cyan-500 text-white self-start">
                      <i className="ti ti-currency-dollar text-xl"></i>
                    </div>

                  </div>
                </div>
                <div id="earning"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 gap-x-0 lg:gap-y-0 gap-y-6">
            <div className="card">
              <div className="card-body">
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Recent Transactions</h4>
                <ul className="timeline-widget relative">
                  <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
                    <div className="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end">
                      9:30 am
                    </div>
                    <div className="timeline-badge-wrap flex flex-col items-center ">
                      <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-blue-600 my-[10px]">
                      </div>
                      <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                    </div>
                    <div className="timeline-desc py-[6px] px-4">
                      <p className="text-gray-600 text-sm font-normal">Payment received from John Doe of $385.90</p>
                    </div>
                  </li>
                  <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
                    <div className="timeline-time text-gray-600 min-w-[90px] py-[6px] text-sm pr-4 text-end">
                      10:00 am
                    </div>
                    <div className="timeline-badge-wrap flex flex-col items-center ">
                      <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-blue-300 my-[10px]">
                      </div>
                      <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                    </div>
                    <div className="timeline-desc py-[6px] px-4 text-sm">
                      <p className="text-gray-600  font-semibold">New sale recorded</p>
                      <a href="javascript:void('')" className="text-blue-600">#ML-3467</a>
                    </div>
                  </li>

                  <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
                    <div className="timeline-time text-gray-600 min-w-[90px] text-sm py-[6px] pr-4 text-end">
                      12:00 am
                    </div>
                    <div className="timeline-badge-wrap flex flex-col items-center ">
                      <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-teal-500 my-[10px]">
                      </div>
                      <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                    </div>
                    <div className="timeline-desc py-[6px] px-4">
                      <p className="text-gray-600 text-sm font-normal">Payment was made of $64.95 to Michael</p>
                    </div>
                  </li>

                  <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
                    <div className="timeline-time text-gray-600 min-w-[90px] text-sm py-[6px] pr-4 text-end">
                      9:30 am
                    </div>
                    <div className="timeline-badge-wrap flex flex-col items-center ">
                      <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-yellow-500 my-[10px]">
                      </div>
                      <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                    </div>
                    <div className="timeline-desc py-[6px] px-4 text-sm">
                      <p className="text-gray-600 font-semibold">New sale recorded</p>
                      <a href="javascript:void('')" className="text-blue-600">#ML-3467</a>
                    </div>
                  </li>

                  <li className="timeline-item flex relative overflow-hidden min-h-[70px]">
                    <div className="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end">
                      9:30 am
                    </div>
                    <div className="timeline-badge-wrap flex flex-col items-center ">
                      <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-red-500 my-[10px]">
                      </div>
                      <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                    </div>
                    <div className="timeline-desc py-[6px] px-4">
                      <p className="text-gray-600 text-sm font-semibold">New arrival recorded</p>
                    </div>
                  </li>
                  <li className="timeline-item flex relative overflow-hidden">
                    <div className="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end">
                      12:00 am
                    </div>
                    <div className="timeline-badge-wrap flex flex-col items-center ">
                      <div className="timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 border-teal-500 my-[10px]">
                      </div>
                      <div className="timeline-badge-border block h-full w-[1px] bg-gray-100"></div>
                    </div>
                    <div className="timeline-desc py-[6px] px-4">
                      <p className="text-gray-600 text-sm font-normal">Payment Done</p>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
            <div className="col-span-2">
              <div className="card h-full">
                <div className="card-body">
                  <h4 className="text-gray-600 text-lg font-semibold mb-6">Recent Transaction</h4>
                  <div className="relative overflow-x-auto">
                    {/* <!-- table --> */}
                    <table className="text-left w-full whitespace-nowrap text-sm">
                      <thead className="text-gray-700">
                        <tr className="font-semibold text-gray-600">
                          <th scope="col" className="p-4">Id</th>
                          <th scope="col" className="p-4">Assigned</th>
                          <th scope="col" className="p-4">Name</th>
                          <th scope="col" className="p-4">Priority</th>
                          <th scope="col" className="p-4">Budget</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 font-semibold text-gray-600 ">1</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <h3 className=" font-semibold text-gray-600">Sunil Joshi</h3>
                              <span className="font-normal text-gray-500">Web Designer</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-normal  text-gray-500">Elite Admin</span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold bg-blue-600 text-white">Low</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-base text-gray-600">$3.9</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-gray-600 ">2</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <h3 className="font-semibold text-gray-600">Andrew McDownland</h3>
                              <span className="font-normal text-gray-500">Project Manager</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-normal text-gray-500">Real Homes WP Theme</span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold text-white bg-cyan-500">Medium</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-base text-gray-600">$24.5k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-gray-600 ">3</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <h3 className="font-semibold text-gray-600">Christopher Jamil</h3>
                              <span className="font-normal text-sm text-gray-500">Project Manager</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-normal text-gray-500">MedicalPro WP Theme</span>
                          </td>
                          <td className="p-4 ">
                            <span className="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold text-white bg-red-500">High</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-base text-gray-600">$12.8k</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-gray-600 ">4</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <h3 className="font-semibold text-gray-600">Nirav Joshi</h3>
                              <span className="font-normal text-sm text-gray-500">Frontend Engineer</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-normal text-sm text-gray-500">Hosting Press HTML</span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center py-[3px] px-[10px] rounded-2xl font-semibold text-white bg-teal-500">Critical</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-base text-gray-600">$2.4k</span>
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-6">
            <div className="card overflow-hidden">
              <div className="relative">
                <a href="javascript:void(0)">
                  <Image src="/images/products/product-1.jpg" alt="product_img" className="w-full" width={200} height={200} />
                </a>
                <a href="javascript:void(0)" className="bg-blue-600 w-8 h-8 flex justify-center items-center text-white rounded-full absolute bottom-0 right-0 mr-4 -mb-3">
                  <i className="ti ti-basket text-base"></i>
                </a>
              </div>
              <div className="card-body">
                <h6 className="text-base font-semibold text-gray-600 mb-1">Boat Headphone</h6>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <h6 className="text-base text-gray-600 font-semibold">$50</h6>
                    <span className="text-gray-500 text-sm">
                      <del>$65</del>
                    </span>
                  </div>
                  <ul className="list-none flex gap-1">
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="relative">
                <a href="javascript:void(0)">
                  <Image src="/images/products/product-2.jpg" alt="product_img" className="w-full" width={200} height={200} />
                </a>
                <a href="javascript:void(0)" className="bg-blue-600 w-8 h-8 flex justify-center items-center text-white rounded-full absolute bottom-0 right-0 mr-4 -mb-3">
                  <i className="ti ti-basket text-base"></i>
                </a>
              </div>
              <div className="card-body">
                <h6 className="text-base font-semibold text-gray-600 mb-1">MacBook Air Pro</h6>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <h6 className="text-base text-gray-600 font-semibold">$650</h6>
                    <span className="text-gray-500 text-sm">
                      <del>$900</del>
                    </span>
                  </div>
                  <ul className="list-none flex gap-1">
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="relative">
                <a href="javascript:void(0)">
                  <Image src="/images/products/product-3.jpg" alt="product_img" className="w-full" width={200} height={200} />
                </a>
                <a href="javascript:void(0)" className="bg-blue-600 w-8 h-8 flex justify-center items-center text-white rounded-full absolute bottom-0 right-0 mr-4 -mb-3">
                  <i className="ti ti-basket text-base"></i>
                </a>
              </div>
              <div className="card-body">
                <h6 className="text-base font-semibold text-gray-600 mb-1">Red Valvet Dress</h6>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <h6 className="text-base text-gray-600 font-semibold">$150</h6>
                    <span className="text-gray-500 text-sm">
                      <del>$200</del>
                    </span>
                  </div>
                  <ul className="list-none flex gap-1">
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="relative">
                <a href="javascript:void(0)"> 
                  <Image src="/images/products/product-4.jpg" alt="product_img" className="w-full" width={200} height={200} />
                </a>
                <a href="javascript:void(0)" className="bg-blue-600 w-8 h-8 flex justify-center items-center text-white rounded-full absolute bottom-0 right-0 mr-4 -mb-3">
                  <i className="ti ti-basket text-base"></i>
                </a>
              </div>
              <div className="card-body">
                <h6 className="text-base font-semibold text-gray-600 mb-1">Cute Soft Teddybear</h6>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <h6 className="text-base text-gray-600 font-semibold">$285</h6>
                    <span className="text-gray-500 text-sm">
                      <del>$345</del>
                    </span>
                  </div>
                  <ul className="list-none flex gap-1">
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" >
                        <i className="ti ti-star text-yellow-500 text-sm"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
   </section>
  )
}

export default DashboardPage